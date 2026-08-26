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
    const trip = await this.findOne(userId, id);
    const member = trip.members.find((m: any) => m.userId === userId);
    if (!member || member.role === 'VIEWER') throw new ForbiddenException('Viewers cannot edit trips');

    const updated = await this.prisma.client.trip.update({
      where: { id },
      data: {
        title: updateTripDto.title,
        description: updateTripDto.description,
        coverImageUrl: updateTripDto.coverImageUrl,
        status: updateTripDto.status,
        startDate: updateTripDto.startDate ? new Date(updateTripDto.startDate) : undefined,
        endDate: updateTripDto.endDate ? new Date(updateTripDto.endDate) : undefined,
        timezone: updateTripDto.timezone,
      },
    });

    await this.logActivity(id, userId, 'UPDATED_TRIP', `Updated trip settings`);
    return updated;
  }

  async setArchiveStatus(userId: string, id: string, isArchived: boolean) {
    const trip = await this.findOne(userId, id);
    const member = trip.members.find((m: any) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can archive trips');
    }

    const updated = await this.prisma.client.trip.update({
      where: { id },
      data: { isArchived }
    });
    
    await this.logActivity(id, userId, isArchived ? 'ARCHIVED_TRIP' : 'RESTORED_TRIP');
    return updated;
  }

  async remove(userId: string, id: string) {
    const trip = await this.findOne(userId, id);
    const member = trip.members.find((m: any) => m.userId === userId);
    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenException('Only the owner can delete the trip');
    }

    return this.prisma.client.trip.delete({ where: { id } });
  }

  async updateMemberRole(userId: string, tripId: string, targetUserId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER') {
    const trip = await this.findOne(userId, tripId);
    const member = trip.members.find((m: any) => m.userId === userId);
    
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only admins can change roles');
    }

    if (role === 'OWNER' && member.role !== 'OWNER') {
      throw new ForbiddenException('Only the current owner can transfer ownership');
    }

    const targetMember = trip.members.find((m: any) => m.userId === targetUserId);
    if (!targetMember) throw new NotFoundException('User not in trip');

    if (role === 'OWNER') {
      // Transfer ownership in a transaction
      return this.prisma.client.$transaction([
        this.prisma.client.tripMember.update({ where: { id: member.id }, data: { role: 'ADMIN' } }),
        this.prisma.client.tripMember.update({ where: { id: targetMember.id }, data: { role: 'OWNER' } })
      ]);
    }

    return this.prisma.client.tripMember.update({
      where: { id: targetMember.id },
      data: { role }
    });
  }

  async getActivity(userId: string, tripId: string) {
    await this.findOne(userId, tripId);
    return this.prisma.client.tripActivityLog.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async logActivity(tripId: string, userId: string | null, action: string, details?: string) {
    return this.prisma.client.tripActivityLog.create({
      data: { tripId, userId, action, details }
    });
  }
}
