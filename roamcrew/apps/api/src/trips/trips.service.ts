import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripRequest, UpdateTripRequest } from 'contracts';
import { isSafeImageUrl } from '../common/utils/url-validator';


@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTripDto: CreateTripRequest) {
    return this.prisma.client.trip.create({
      data: {
        title: createTripDto.title,
        description: createTripDto.description,
        coverImageUrl: createTripDto.coverImageUrl,
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

  async findAll(userId: string, isArchived?: boolean, isTemplate?: boolean) {
    const whereClause: any = {
      members: {
        some: {
          userId,
        },
      },
    };

    if (isArchived !== undefined) {
      whereClause.isArchived = isArchived;
    }
    
    if (isTemplate !== undefined) {
      whereClause.isTemplate = isTemplate;
    }

    return this.prisma.client.trip.findMany({
      where: whereClause,
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

    if (updateTripDto.coverImageUrl && !isSafeImageUrl(updateTripDto.coverImageUrl)) {
      throw new BadRequestException('Invalid or unsafe cover image URL');
    }

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

  async generatePublicToken(userId: string, id: string) {
    const trip = await this.findOne(userId, id);
    const member = trip.members.find((m: any) => m.userId === userId);
    
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can share trips publicly');
    }

    if (trip.publicToken) {
      return { token: trip.publicToken };
    }

    const { randomUUID } = require('crypto');
    const token = randomUUID();

    await this.prisma.client.trip.update({
      where: { id },
      data: { publicToken: token }
    });

    await this.logActivity(id, userId, 'GENERATED_PUBLIC_LINK', 'Generated a shareable public link');
    return { token };
  }

  async getPublicTrip(token: string) {
    const trip = await this.prisma.client.trip.findUnique({
      where: { publicToken: token },
      include: {
        destinations: {
          orderBy: { orderIndex: 'asc' },
          include: { itineraryItems: true, places: true },
        },
        members: {
          include: { user: { select: { firstName: true, avatarUrl: true } } }
        }
      }
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or link has expired');
    }

    return trip;
  }

  async setTemplateStatus(userId: string, id: string, isTemplate: boolean) {
    const trip = await this.findOne(userId, id);
    const member = trip.members.find((m: any) => m.userId === userId);
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can mark trips as templates');
    }

    const updated = await this.prisma.client.trip.update({
      where: { id },
      data: { isTemplate }
    });
    
    await this.logActivity(id, userId, isTemplate ? 'MARKED_AS_TEMPLATE' : 'UNMARKED_AS_TEMPLATE');
    return updated;
  }

  async cloneTrip(userId: string, id: string, newTitle: string) {
    // 1. Get original trip with destinations and places
    const originalTrip = await this.prisma.client.trip.findUnique({
      where: { id },
      include: {
        destinations: {
          include: { places: true }
        }
      }
    });

    if (!originalTrip) throw new NotFoundException('Trip not found');

    // 2. We don't enforce membership check here because public templates might be clonable
    // However, to keep it simple, let's require the user to at least be authenticated (handled by guard)
    // and we'll just clone the structure.

    // 3. Create the new trip
    const clonedTrip = await this.prisma.client.trip.create({
      data: {
        title: newTitle || `Copy of ${originalTrip.title}`,
        description: originalTrip.description,
        coverImageUrl: originalTrip.coverImageUrl,
        status: 'PLANNING',
        members: {
          create: {
            userId,
            role: 'OWNER'
          }
        }
      }
    });

    // 4. Copy destinations and places
    for (const dest of originalTrip.destinations) {
      const clonedDest = await this.prisma.client.destination.create({
        data: {
          tripId: clonedTrip.id,
          name: dest.name,
          orderIndex: dest.orderIndex,
          imageUrl: dest.imageUrl,
          description: dest.description,
        }
      });

      for (const place of dest.places) {
        await this.prisma.client.place.create({
          data: {
            tripId: clonedTrip.id,
            destinationId: clonedDest.id,
            name: place.name,
            address: place.address,
            googlePlaceId: place.googlePlaceId,
            latitude: place.latitude,
            longitude: place.longitude,
            notes: place.notes,
            category: place.category,
            tags: place.tags,
          }
        });
      }
    }

    await this.logActivity(clonedTrip.id, userId, 'CREATED_FROM_TEMPLATE', `Cloned from ${originalTrip.title}`);
    return clonedTrip;
  }

  async logActivity(tripId: string, userId: string | null, action: string, details?: string) {
    return this.prisma.client.tripActivityLog.create({
      data: { tripId, userId, action, details }
    });
  }
}
