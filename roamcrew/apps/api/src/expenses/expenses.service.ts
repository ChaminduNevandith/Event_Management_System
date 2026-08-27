import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseRequest } from 'contracts';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAllForTrip(userId: string, tripId: string) {
    const trip = await this.prisma.client.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const isMember = trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return this.prisma.client.expense.findMany({
      where: { tripId },
      include: {
        payer: { select: { id: true, firstName: true, lastName: true } },
        splits: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: string, tripId: string, dto: CreateExpenseRequest) {
    const trip = await this.prisma.client.trip.findUnique({
      where: { id: tripId },
      include: { members: { include: { user: true } } },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const isMember = trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    // Double check that the payer and split users are all in the trip
    const memberIds = new Set(trip.members.map((m: any) => m.userId));
    if (!memberIds.has(dto.payerId)) {
      throw new BadRequestException('Payer is not a member of the trip');
    }
    for (const split of dto.splits) {
      if (!memberIds.has(split.userId)) {
        throw new BadRequestException(`User ${split.userId} is not a member of the trip`);
      }
    }

    // Verify splits math adds up perfectly (ignoring tiny floats for now, or just doing a basic check)
    const totalSplits = dto.splits.reduce((acc, split) => acc + split.amount, 0);
    if (Math.abs(totalSplits - dto.amount) > 0.01) {
      throw new BadRequestException('Splits do not sum up to the total expense amount');
    }

    const expense = await this.prisma.client.expense.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        date: dto.date ? new Date(dto.date) : new Date(),
        category: (dto.category as any) || 'OTHER',
        tripId,
        payerId: dto.payerId,
        splits: {
          create: dto.splits.map(s => ({
            userId: s.userId,
            amount: s.amount,
          })),
        },
      },
      include: {
        payer: { select: { id: true, firstName: true, lastName: true } },
        splits: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    const actor = trip.members.find((m: any) => m.userId === userId);
    const actorName = actor?.user?.firstName || 'A member';
    
    // Add activity log
    await this.prisma.client.tripActivityLog.create({
      data: {
        tripId,
        userId,
        action: 'EXPENSE_ADDED',
        details: `${actorName} added an expense: ${dto.title} (${dto.amount})`
      }
    });

    // Notify users involved in the split (except the one who added it)
    const splitUsers = dto.splits.map(s => s.userId).filter(id => id !== userId);
    for (const splitUserId of splitUsers) {
      await this.prisma.client.notification.create({
        data: {
          userId: splitUserId,
          tripId,
          title: "New Expense",
          message: `${actorName} added an expense you are part of: ${dto.title}`,
          type: "EXPENSE",
          link: `/trips/${tripId}/budget`
        }
      });
    }

    return expense;
  }

  async getBalances(userId: string, tripId: string) {
    const trip = await this.prisma.client.trip.findUnique({
      where: { id: tripId },
      include: { members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } } } },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const isMember = trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    const expenses = await this.prisma.client.expense.findMany({
      where: { tripId },
      include: { splits: true },
    });

    const balancesByCurrency: Record<string, Record<string, { user: any; amount: number }>> = {};

    for (const expense of expenses) {
      const cur = expense.currency;
      if (!balancesByCurrency[cur]) {
        balancesByCurrency[cur] = {};
        for (const member of trip.members) {
          balancesByCurrency[cur][member.userId] = { user: member.user, amount: 0 };
        }
      }

      if (balancesByCurrency[cur][expense.payerId]) {
        balancesByCurrency[cur][expense.payerId].amount += expense.amount;
      }
      for (const split of expense.splits) {
        if (balancesByCurrency[cur][split.userId]) {
          balancesByCurrency[cur][split.userId].amount -= split.amount;
        }
      }
    }

    return Object.entries(balancesByCurrency).map(([currency, balances]) => ({
      currency,
      balances: Object.values(balances),
    }));
  }

  async getSettlements(userId: string, tripId: string) {
    const balancesData = await this.getBalances(userId, tripId);
    
    const settlementsByCurrency = [];

    for (const currencyData of balancesData) {
      const { currency, balances } = currencyData;

      // Separate into debtors (balance < 0) and creditors (balance > 0)
      const debtors = balances.filter(b => b.amount < -0.01).map(b => ({ ...b, amount: Math.abs(b.amount) })).sort((a, b) => b.amount - a.amount);
      const creditors = balances.filter(b => b.amount > 0.01).sort((a, b) => b.amount - a.amount);
      
      const settlements = [];
      let i = 0; // debtors index
      let j = 0; // creditors index
      
      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        
        const amount = Math.min(debtor.amount, creditor.amount);
        
        settlements.push({
          from: debtor.user,
          to: creditor.user,
          amount: parseFloat(amount.toFixed(2)),
        });
        
        debtor.amount -= amount;
        creditor.amount -= amount;
        
        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
      }

      settlementsByCurrency.push({
        currency,
        settlements,
      });
    }
    
    return settlementsByCurrency;
  }

  async remove(userId: string, tripId: string, expenseId: string) {
    const expense = await this.prisma.client.expense.findUnique({
      where: { id: expenseId },
      include: { trip: { include: { members: true } } },
    });

    if (!expense || expense.tripId !== tripId) {
      throw new NotFoundException('Expense not found');
    }

    const isMember = expense.trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return this.prisma.client.expense.delete({
      where: { id: expenseId },
    });
  }
}
