import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateDestinationRequest, 
  UpdateDestinationRequest,
  DestinationVoteRequest
} from 'contracts';
import { TripsService } from '../trips/trips.service';
import { DestinationStatus, VoteType } from 'database';
// Force TS Cache refresh

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
        description: createDestinationDto.description,
        imageUrl: createDestinationDto.imageUrl,
        googlePlaceId: createDestinationDto.googlePlaceId,
        latitude: createDestinationDto.latitude,
        longitude: createDestinationDto.longitude,
        startDate: createDestinationDto.startDate ? new Date(createDestinationDto.startDate) : undefined,
        endDate: createDestinationDto.endDate ? new Date(createDestinationDto.endDate) : undefined,
        orderIndex: nextOrderIndex,
      },
    });
  }

  async findAll(userId: string, tripId: string) {
    await this.tripsService.findOne(userId, tripId);
    return this.prisma.client.destination.findMany({
      where: { tripId },
      include: {
        votes: {
          select: { userId: true, voteType: true }
        }
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async update(userId: string, tripId: string, id: string, updateDto: UpdateDestinationRequest) {
    await this.tripsService.findOne(userId, tripId);

    // Ensure the destination belongs to the trip
    const dest = await this.prisma.client.destination.findFirst({
      where: { id, tripId }
    });
    if (!dest) {
      throw new NotFoundException('Destination not found');
    }

    return this.prisma.client.destination.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        imageUrl: updateDto.imageUrl,
        googlePlaceId: updateDto.googlePlaceId,
        latitude: updateDto.latitude,
        longitude: updateDto.longitude,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        status: updateDto.status as DestinationStatus | undefined,
        orderIndex: updateDto.orderIndex,
      }
    });
  }

  async vote(userId: string, tripId: string, id: string, voteDto: DestinationVoteRequest) {
    await this.tripsService.findOne(userId, tripId);

    const dest = await this.prisma.client.destination.findFirst({
      where: { id, tripId }
    });
    if (!dest) {
      throw new NotFoundException('Destination not found');
    }

    // Upsert the vote
    return this.prisma.client.destinationVote.upsert({
      where: {
        destinationId_userId: {
          destinationId: id,
          userId,
        }
      },
      update: {
        voteType: voteDto.voteType as VoteType,
      },
      create: {
        destinationId: id,
        userId,
        voteType: voteDto.voteType as VoteType,
      }
    });
  }

  async remove(userId: string, tripId: string, id: string) {
    await this.tripsService.findOne(userId, tripId);
    return this.prisma.client.destination.delete({
      where: { id },
    });
  }
}
