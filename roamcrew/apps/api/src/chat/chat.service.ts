import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
// Force TS cache refresh

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessagesForTrip(userId: string, tripId: string) {
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

    return this.prisma.client.message.findMany({
      where: { tripId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveMessage(userId: string, tripId: string, content: string) {
    // Validate membership
    const trip = await this.prisma.client.trip.findUnique({
      where: { id: tripId },
      include: { members: true },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    const isMember = trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new Error('You do not have access to this trip');
    }

    return this.prisma.client.message.create({
      data: {
        content,
        tripId,
        userId,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}

// Force TS reload
