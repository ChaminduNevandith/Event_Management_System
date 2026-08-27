import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalTrips] = await Promise.all([
      this.prisma.client.user.count(),
      this.prisma.client.trip.count(),
    ]);
    
    // activeUsers could be calculated based on recent logins or trip creation.
    // For now, we mock it based on totalUsers
    return {
      totalUsers,
      totalTrips,
      activeUsers: Math.floor(totalUsers * 0.7),
    };
  }

  async getUsers() {
    return this.prisma.client.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        // @ts-ignore - Prisma typings need regeneration after restart
        role: true,
      },
      orderBy: { id: 'asc' },
    });
  }
}
