import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getEventsForUser(userId: string) {
    const items = await this.prisma.client.itineraryItem.findMany({
      where: {
        destination: {
          trip: {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
      include: {
        destination: {
          include: {
            trip: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    const trips = await this.prisma.client.trip.findMany({
      where: {
        members: {
          some: { userId: userId },
        },
        startDate: { not: null },
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
      }
    });

    return { items, trips };
  }
}
