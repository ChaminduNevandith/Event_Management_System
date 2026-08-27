import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async getTripActivityLogs(tripId: string) {
    return this.prisma.client.tripActivityLog.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // Internal helper to create a log (to be used by other services)
  async logAction(data: {
    tripId: string;
    userId?: string;
    action: string;
    details?: string;
  }) {
    return this.prisma.client.tripActivityLog.create({
      data: {
        ...data,
      },
    });
  }
}
