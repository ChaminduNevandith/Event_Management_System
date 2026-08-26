import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransportRequest, UpdateTransportRequest, TransportType } from 'contracts';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async create(tripId: string, data: CreateTransportRequest) {
    const trip = await this.prisma.client.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    return this.prisma.client.transport.create({
      data: {
        tripId,
        type: data.type as TransportType,
        departureTime: data.departureTime ? new Date(data.departureTime) : null,
        arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : null,
        origin: data.origin,
        destination: data.destination,
        bookingRef: data.bookingRef,
        seatNumber: data.seatNumber,
        notes: data.notes,
      },
    });
  }

  async findAll(tripId: string) {
    return this.prisma.client.transport.findMany({
      where: { tripId },
      orderBy: { departureTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.client.transport.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Transport not found');
    return item;
  }

  async update(id: string, data: UpdateTransportRequest) {
    await this.findOne(id); // Ensure it exists
    
    return this.prisma.client.transport.update({
      where: { id },
      data: {
        type: data.type ? (data.type as TransportType) : undefined,
        departureTime: data.departureTime ? new Date(data.departureTime) : undefined,
        arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : undefined,
        origin: data.origin,
        destination: data.destination,
        bookingRef: data.bookingRef,
        seatNumber: data.seatNumber,
        notes: data.notes,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.transport.delete({ where: { id } });
  }
}
