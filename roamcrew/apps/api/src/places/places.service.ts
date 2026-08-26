import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreatePlaceRequest, UpdatePlaceRequest } from 'contracts';
import { PlaceCategory } from 'database';
// Force TS cache refresh

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService
  ) {}

  async create(userId: string, tripId: string, createDto: CreatePlaceRequest) {
    await this.tripsService.findOne(userId, tripId);

    // If destinationId is provided, verify it exists
    if (createDto.destinationId) {
      const dest = await this.prisma.client.destination.findFirst({
        where: { id: createDto.destinationId, tripId }
      });
      if (!dest) throw new NotFoundException('Destination not found');
    }

    return this.prisma.client.place.create({
      data: {
        tripId,
        destinationId: createDto.destinationId,
        name: createDto.name,
        googlePlaceId: createDto.googlePlaceId,
        latitude: createDto.latitude,
        longitude: createDto.longitude,
        address: createDto.address,
        category: createDto.category as PlaceCategory | undefined,
        notes: createDto.notes,
        tags: createDto.tags || [],
        imageUrls: createDto.imageUrls || [],
      }
    });
  }

  async findAll(userId: string, tripId: string, destinationId?: string) {
    await this.tripsService.findOne(userId, tripId);
    
    return this.prisma.client.place.findMany({
      where: { 
        tripId,
        ...(destinationId ? { destinationId } : {})
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, tripId: string, id: string, updateDto: UpdatePlaceRequest) {
    await this.tripsService.findOne(userId, tripId);

    const place = await this.prisma.client.place.findFirst({
      where: { id, tripId }
    });
    if (!place) throw new NotFoundException('Place not found');

    if (updateDto.destinationId) {
      const dest = await this.prisma.client.destination.findFirst({
        where: { id: updateDto.destinationId, tripId }
      });
      if (!dest) throw new NotFoundException('Destination not found');
    }

    return this.prisma.client.place.update({
      where: { id },
      data: {
        destinationId: updateDto.destinationId,
        name: updateDto.name,
        googlePlaceId: updateDto.googlePlaceId,
        latitude: updateDto.latitude,
        longitude: updateDto.longitude,
        address: updateDto.address,
        category: updateDto.category as PlaceCategory | undefined,
        notes: updateDto.notes,
        tags: updateDto.tags,
        imageUrls: updateDto.imageUrls,
      }
    });
  }

  async remove(userId: string, tripId: string, id: string) {
    await this.tripsService.findOne(userId, tripId);
    return this.prisma.client.place.delete({
      where: { id },
    });
  }
}
