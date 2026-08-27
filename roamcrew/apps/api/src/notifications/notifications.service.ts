import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const pubKey = process.env.VAPID_PUBLIC_KEY;
    const privKey = process.env.VAPID_PRIVATE_KEY;
    if (pubKey && privKey) {
      webpush.setVapidDetails(
        'mailto:contact@roamcrew.com',
        pubKey,
        privKey
      );
    } else {
      console.warn("VAPID keys not found. Push notifications will not work.");
    }
  }

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

  // --- Settings ---
  async getSettings(userId: string) {
    let settings = await this.prisma.client.notificationSettings.findUnique({
      where: { userId },
    });
    if (!settings) {
      settings = await this.prisma.client.notificationSettings.create({
        data: { userId },
      });
    }
    return settings;
  }

  async updateSettings(userId: string, data: any) {
    return this.prisma.client.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  // --- Push Subscriptions ---
  async subscribePush(userId: string, subscription: any) {
    return this.prisma.client.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId,
          endpoint: subscription.endpoint,
        },
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  async unsubscribePush(userId: string, endpoint: string) {
    await this.prisma.client.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
    return { success: true };
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
    const notification = await this.prisma.client.notification.create({
      data: {
        ...data,
      },
    });

    // Check settings for push notification
    const settings = await this.getSettings(data.userId);
    if (settings.pushEnabled) {
      // Check quiet hours
      let isQuietHours = false;
      if (settings.quietHoursEnabled) {
        const now = new Date();
        const hour = now.getUTCHours(); // Simplified: should ideally use user timezone
        const minute = now.getUTCMinutes();
        
        const [startH, startM] = settings.quietHoursStart.split(':').map(Number);
        const [endH, endM] = settings.quietHoursEnd.split(':').map(Number);
        
        const currentMins = hour * 60 + minute;
        const startMins = startH * 60 + startM;
        const endMins = endH * 60 + endM;
        
        if (startMins <= endMins) {
          isQuietHours = currentMins >= startMins && currentMins < endMins;
        } else {
          // Crosses midnight
          isQuietHours = currentMins >= startMins || currentMins < endMins;
        }
      }

      if (!isQuietHours) {
        const subscriptions = await this.prisma.client.pushSubscription.findMany({
          where: { userId: data.userId },
        });

        const payload = JSON.stringify({
          title: data.title,
          body: data.message,
          url: data.link,
          icon: '/icon-192x192.png'
        });

        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth },
              },
              payload
            );
          } catch (e: any) {
            if (e.statusCode === 410) {
              await this.unsubscribePush(data.userId, sub.endpoint);
            }
          }
        }
      }
    }

    return notification;
  }
}
