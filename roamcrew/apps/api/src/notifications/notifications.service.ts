import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.client.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        trip: {
          select: { title: true },
        },
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.client.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.client.notification.findUnique({
      where: { id: notificationId },
    });
    
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    
    return this.prisma.client.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.client.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Internal helper to create a notification (to be used by other services)
  async create(data: {
    userId: string;
    tripId?: string;
    title: string;
    message: string;
    type?: any;
    link?: string;
  }) {
    return this.prisma.client.notification.create({
      data: {
        ...data,
      },
    });
  }
}
