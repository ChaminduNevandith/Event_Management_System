import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Force TS cache refresh
@Injectable()
export class CirclesService {
  constructor(private prisma: PrismaService) {}

  async createCircle(userId: string, data: { name: string; description?: string; imageUrl?: string }) {
    return this.prisma.client.travelCircle.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } } } }
      }
    });
  }

  async getMyCircles(userId: string) {
    return this.prisma.client.travelCircle.findMany({
      where: {
        members: { some: { userId } }
      },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } },
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } } } }
      }
    });
  }

  async getCircleById(userId: string, circleId: string) {
    const circle = await this.prisma.client.travelCircle.findUnique({
      where: { id: circleId },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } },
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } } } }
      }
    });
    
    if (!circle) throw new NotFoundException('Circle not found');
    const isMember = circle.members.some((m: any) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('You are not a member of this circle');
    
    return circle;
  }

  async addMember(userId: string, circleId: string, memberUsername: string) {
    const circle = await this.prisma.client.travelCircle.findUnique({
      where: { id: circleId },
      include: { members: true }
    });

    if (!circle) throw new NotFoundException('Circle not found');
    const isAdmin = circle.members.some((m: any) => m.userId === userId && m.role === 'ADMIN');
    if (!isAdmin) throw new ForbiddenException('Only admins can add members');

    const targetUser = await this.prisma.client.user.findUnique({ where: { username: memberUsername } });
    if (!targetUser) throw new NotFoundException('User not found');

    const isAlreadyMember = circle.members.some((m: any) => m.userId === targetUser.id);
    if (isAlreadyMember) throw new BadRequestException('User is already a member');

    return this.prisma.client.circleMember.create({
      data: {
        circleId,
        userId: targetUser.id,
        role: 'MEMBER'
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } }
      }
    });
  }

  async removeMember(userId: string, circleId: string, memberId: string) {
    const circle = await this.prisma.client.travelCircle.findUnique({
      where: { id: circleId },
      include: { members: true }
    });

    if (!circle) throw new NotFoundException('Circle not found');
    
    const isAdmin = circle.members.some((m: any) => m.userId === userId && m.role === 'ADMIN');
    if (!isAdmin && userId !== memberId) throw new ForbiddenException('Only admins can remove other members');
    if (memberId === circle.ownerId) throw new BadRequestException('Cannot remove the circle owner');

    const membership = circle.members.find((m: any) => m.userId === memberId);
    if (!membership) throw new NotFoundException('Member not found in circle');

    return this.prisma.client.circleMember.delete({
      where: { id: membership.id }
    });
  }
}

// Force TS reload
