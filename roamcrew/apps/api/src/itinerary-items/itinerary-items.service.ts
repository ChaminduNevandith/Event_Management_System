import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItineraryItemRequest, UpdateItineraryItemRequest } from 'contracts';

@Injectable()
export class ItineraryItemsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, tripId: string, destinationId: string, dto: CreateItineraryItemRequest) {
    // 1. Verify trip and access
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

    // 2. Verify destination belongs to trip
    const dest = await this.prisma.client.destination.findFirst({
      where: { id: destinationId, tripId },
    });

    if (!dest) {
      throw new NotFoundException('Destination not found on this trip');
    }

    // 3. Create Item
    return this.prisma.client.itineraryItem.create({
      data: {
        destinationId,
        title: dto.title,
        description: dto.description,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        isAllDay: dto.isAllDay || false,
        type: (dto.type as any) || 'ACTIVITY',
      },
    });
  }

  async update(userId: string, tripId: string, itemId: string, dto: UpdateItineraryItemRequest) {
    // Verify trip access and item exists
    const item = await this.prisma.client.itineraryItem.findUnique({
      where: { id: itemId },
      include: { destination: { include: { trip: { include: { members: true } } } } },
    });

    if (!item || item.destination.tripId !== tripId) {
      throw new NotFoundException('Itinerary item not found');
    }

    const isMember = item.destination.trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return this.prisma.client.itineraryItem.update({
      where: { id: itemId },
      data: {
        title: dto.title,
        description: dto.description,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        isAllDay: dto.isAllDay,
        type: dto.type as any,
      },
    });
  }

  async remove(userId: string, tripId: string, itemId: string) {
    // Verify access
    const item = await this.prisma.client.itineraryItem.findUnique({
      where: { id: itemId },
      include: { destination: { include: { trip: { include: { members: true } } } } },
    });

    if (!item || item.destination.tripId !== tripId) {
      throw new NotFoundException('Itinerary item not found');
    }

    const isMember = item.destination.trip.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return this.prisma.client.itineraryItem.delete({
      where: { id: itemId },
    });
  }
}
