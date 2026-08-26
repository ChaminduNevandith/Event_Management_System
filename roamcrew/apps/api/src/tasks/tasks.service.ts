import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(tripId: string, userId: string, data: any) {
    const member = await (this.prisma as any).tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } }
    });
    if (!member) throw new ForbiddenException("You do not have access to this trip");

    return (this.prisma as any).task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        category: data.category || 'GENERAL',
        status: data.status || 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        tripId,
        assigneeId: data.assigneeId || null
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        }
      }
    });
  }

  async findAll(tripId: string, userId: string) {
    const member = await (this.prisma as any).tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } }
    });
    if (!member) throw new ForbiddenException("You do not have access to this trip");

    return (this.prisma as any).task.findMany({
      where: { tripId },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async update(tripId: string, taskId: string, userId: string, data: any) {
    const member = await (this.prisma as any).tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } }
    });
    if (!member) throw new ForbiddenException("You do not have access to this trip");

    const task = await (this.prisma as any).task.findUnique({ where: { id: taskId, tripId } });
    if (!task) throw new NotFoundException("Task not found");

    return (this.prisma as any).task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId !== undefined ? data.assigneeId : undefined
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        }
      }
    });
  }

  async remove(tripId: string, taskId: string, userId: string) {
    const member = await (this.prisma as any).tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } }
    });
    if (!member) throw new ForbiddenException("You do not have access to this trip");

    const task = await (this.prisma as any).task.findUnique({ where: { id: taskId, tripId } });
    if (!task) throw new NotFoundException("Task not found");

    await (this.prisma as any).task.delete({ where: { id: taskId } });
    return { success: true };
  }
}
