import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FriendsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async getFriends(userId: string) {
    // Get all friendships where user is involved and status is ACCEPTED
    const friendships = await this.prisma.client.friendship.findMany({
      where: {
        OR: [
          { userId: userId, status: 'ACCEPTED' },
          { friendId: userId, status: 'ACCEPTED' },
        ]
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true } },
        friend: { select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true } }
      }
    });

    return friendships.map((f: any) => f.userId === userId ? f.friend : f.user);
  }

  async getPendingRequests(userId: string) {
    // Requests sent TO this user
    return this.prisma.client.friendship.findMany({
      where: { friendId: userId, status: 'PENDING' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true } }
      }
    });
  }

  async sendRequest(userId: string, targetUsername?: string, targetUserId?: string) {
    let target;
    if (targetUserId) {
      target = await this.prisma.client.user.findUnique({ where: { id: targetUserId } });
    } else if (targetUsername) {
      target = await this.prisma.client.user.findUnique({ where: { username: targetUsername } });
    }
    if (!target) throw new NotFoundException('User not found');
    if (target.id === userId) throw new BadRequestException('Cannot send friend request to yourself');

    const existing = await this.prisma.client.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: target.id },
          { userId: target.id, friendId: userId },
        ]
      }
    });

    let friendship;
    if (existing) {
      if (existing.status === 'PENDING') throw new ConflictException('Request already pending');
      if (existing.status === 'ACCEPTED') throw new ConflictException('Already friends');
      if (existing.status === 'BLOCKED') throw new ForbiddenException('Cannot send request');
      
      // If it was DECLINED, we update it to PENDING and swap IDs if necessary
      friendship = await this.prisma.client.friendship.update({
        where: { id: existing.id },
        data: {
          userId,
          friendId: target.id,
          status: 'PENDING'
        }
      });
    } else {
      friendship = await this.prisma.client.friendship.create({
        data: {
          userId,
          friendId: target.id,
          status: 'PENDING'
        }
      });
    }

    const sender = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (sender) {
      await this.notificationsService.create({
        userId: target.id,
        title: 'New Friend Request',
        message: `${sender.firstName || sender.username} sent you a friend request.`,
        type: 'SYSTEM',
        link: '/friends',
      });
    }

    return friendship;
  }

  async acceptRequest(userId: string, requestId: string) {
    const req = await this.prisma.client.friendship.findUnique({ where: { id: requestId } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.friendId !== userId) throw new BadRequestException('Not authorized');

    return this.prisma.client.friendship.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' }
    });
  }

  async declineRequest(userId: string, requestId: string) {
    const req = await this.prisma.client.friendship.findUnique({ where: { id: requestId } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.friendId !== userId) throw new BadRequestException('Not authorized');

    return this.prisma.client.friendship.update({
      where: { id: requestId },
      data: { status: 'DECLINED' }
    });
  }

  async removeFriend(userId: string, friendId: string) {
    const existing = await this.prisma.client.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ]
      }
    });

    if (!existing) throw new NotFoundException('Friendship not found');

    return this.prisma.client.friendship.delete({
      where: { id: existing.id }
    });
  }
}
