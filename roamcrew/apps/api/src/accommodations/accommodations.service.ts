import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccommodationRequest, UpdateAccommodationRequest } from 'contracts';

@Injectable()
export class AccommodationsService {
  constructor(private prisma: PrismaService) {}

  async create(tripId: string, data: CreateAccommodationRequest) {
    const trip = await this.prisma.client.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    return this.prisma.client.accommodation.create({
      data: {
        tripId,
        name: data.name,
        address: data.address,
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        bookingRef: data.bookingRef,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        notes: data.notes,
      },
    });
  }

  async findAll(tripId: string) {
    return this.prisma.client.accommodation.findMany({
      where: { tripId },
      orderBy: { checkIn: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.client.accommodation.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Accommodation not found');
    return item;
  }

  async update(id: string, data: UpdateAccommodationRequest) {
    await this.findOne(id); // Ensure it exists
    
    return this.prisma.client.accommodation.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
        checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
        bookingRef: data.bookingRef,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        notes: data.notes,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.accommodation.delete({ where: { id } });
  }
}
