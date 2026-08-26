import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripRequest, UpdateTripRequest } from 'contracts';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTripDto: CreateTripRequest) {
    return this.prisma.client.trip.create({
      data: {
        title: createTripDto.title,
        description: createTripDto.description,
        startDate: createTripDto.startDate ? new Date(createTripDto.startDate) : undefined,
        endDate: createTripDto.endDate ? new Date(createTripDto.endDate) : undefined,
        timezone: createTripDto.timezone,
        members: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.client.trip.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const trip = await this.prisma.client.trip.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
        destinations: {
          orderBy: { orderIndex: 'asc' },
          include: { itineraryItems: true },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const isMember = trip.members.some((member: any) => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this trip');
    }

    return trip;
  }

  async update(userId: string, id: string, updateTripDto: UpdateTripRequest) {
    // Check access first
    await this.findOne(userId, id);

    return this.prisma.client.trip.update({
      where: { id },
      data: {
        title: updateTripDto.title,
        description: updateTripDto.description,
        startDate: updateTripDto.startDate ? new Date(updateTripDto.startDate) : undefined,
        endDate: updateTripDto.endDate ? new Date(updateTripDto.endDate) : undefined,
        timezone: updateTripDto.timezone,
      },
    });
  }
}
