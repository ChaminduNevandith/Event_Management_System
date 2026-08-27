import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreateItineraryItemRequest, UpdateItineraryItemRequest, ItemType } from 'contracts';

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
        placeId: dto.placeId || null,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
      },
      include: {
        destination: true,
        place: true,
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
        place: true,
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async update(userId: string, tripId: string, id: string, dto: UpdateItineraryItemRequest) {
    await this.tripsService.findOne(userId, tripId);

    const item = await this.prisma.client.itineraryItem.findFirst({
      where: { id, destination: { tripId } }
    });
    if (!item) throw new NotFoundException("Itinerary item not found");

    const dataToUpdate: any = {};
    if (dto.title !== undefined) dataToUpdate.title = dto.title;
    if (dto.description !== undefined) dataToUpdate.description = dto.description;
    if (dto.type !== undefined) dataToUpdate.type = dto.type as ItemType;
    if (dto.startTime !== undefined) dataToUpdate.startTime = dto.startTime ? new Date(dto.startTime) : null;
    if (dto.endTime !== undefined) dataToUpdate.endTime = dto.endTime ? new Date(dto.endTime) : null;
    if (dto.isAllDay !== undefined) dataToUpdate.isAllDay = dto.isAllDay;
    if (dto.placeId !== undefined) dataToUpdate.placeId = dto.placeId;
    if (dto.latitude !== undefined) dataToUpdate.latitude = dto.latitude;
    if (dto.longitude !== undefined) dataToUpdate.longitude = dto.longitude;

    if (dto.destinationId) {
      const dest = await this.prisma.client.destination.findFirst({
        where: { id: dto.destinationId, tripId }
      });
      if (!dest) throw new NotFoundException("Destination not found or doesn't belong to this trip");
      dataToUpdate.destinationId = dto.destinationId;
    }

    return this.prisma.client.itineraryItem.update({
      where: { id },
      data: dataToUpdate,
      include: {
        destination: true,
        place: true,
      }
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

