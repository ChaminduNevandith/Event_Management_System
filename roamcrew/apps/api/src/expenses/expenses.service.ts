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
      include: { members: true },
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

    return this.prisma.client.expense.create({
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

    const balances: Record<string, { user: any; amount: number }> = {};
    for (const member of trip.members) {
      balances[member.userId] = { user: member.user, amount: 0 };
    }

    for (const expense of expenses) {
      if (balances[expense.payerId]) {
        balances[expense.payerId].amount += expense.amount;
      }
      for (const split of expense.splits) {
        if (balances[split.userId]) {
          balances[split.userId].amount -= split.amount;
        }
      }
    }

    return Object.values(balances);
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
