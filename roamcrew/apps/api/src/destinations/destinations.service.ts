import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationRequest } from 'contracts';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class DestinationsService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService
  ) {}

  async create(userId: string, tripId: string, createDestinationDto: CreateDestinationRequest) {
    // Re-use TripsService to ensure the user has access to this trip
    await this.tripsService.findOne(userId, tripId);

    // Get the current highest orderIndex for this trip
    const lastDest = await this.prisma.client.destination.findFirst({
      where: { tripId },
      orderBy: { orderIndex: 'desc' },
    });
    
    const nextOrderIndex = lastDest ? lastDest.orderIndex + 1 : 0;

    return this.prisma.client.destination.create({
      data: {
        tripId,
        name: createDestinationDto.name,
        googlePlaceId: createDestinationDto.googlePlaceId,
        latitude: createDestinationDto.latitude,
        longitude: createDestinationDto.longitude,
        startDate: createDestinationDto.startDate ? new Date(createDestinationDto.startDate) : undefined,
        endDate: createDestinationDto.endDate ? new Date(createDestinationDto.endDate) : undefined,
        orderIndex: nextOrderIndex,
      },
    });
  }

  async remove(userId: string, tripId: string, id: string) {
    await this.tripsService.findOne(userId, tripId);
    return this.prisma.client.destination.delete({
      where: { id },
    });
  }
}
