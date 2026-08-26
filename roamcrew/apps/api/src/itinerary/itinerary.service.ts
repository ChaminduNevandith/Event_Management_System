import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreateItineraryItemRequest, ItemType } from 'contracts';

@Injectable()
export class ItineraryService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService
  ) {}

  async create(userId: string, tripId: string, dto: CreateItineraryItemRequest) {
    await this.tripsService.findOne(userId, tripId); // verifies membership

    // Verify destination belongs to trip
    const dest = await this.prisma.client.destination.findFirst({
      where: { id: dto.destinationId, tripId }
    });
    if (!dest) throw new NotFoundException("Destination not found or doesn't belong to this trip");

    return this.prisma.client.itineraryItem.create({
      data: {
        destinationId: dto.destinationId,
        title: dto.title,
        description: dto.description,
        type: dto.type as ItemType,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        isAllDay: dto.isAllDay || false,
      },
      include: {
        destination: true,
      }
    });
  }

  async findAll(userId: string, tripId: string) {
    await this.tripsService.findOne(userId, tripId);

    return this.prisma.client.itineraryItem.findMany({
      where: { 
        destination: { tripId } 
      },
      include: {
        destination: true,
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async remove(userId: string, tripId: string, id: string) {
    await this.tripsService.findOne(userId, tripId);

    const item = await this.prisma.client.itineraryItem.findFirst({
      where: { id, destination: { tripId } }
    });

    if (!item) throw new NotFoundException("Itinerary item not found");

    await this.prisma.client.itineraryItem.delete({
      where: { id }
    });

    return { success: true };
  }
}

