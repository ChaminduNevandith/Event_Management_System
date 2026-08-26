import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreatePollRequest, PollVoteRequest, PollCommentRequest } from 'contracts';

@Injectable()
export class PollsService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService,
  ) {}

  async createPoll(userId: string, tripId: string, dto: CreatePollRequest) {
    await this.tripsService.findOne(userId, tripId);
    
    return this.prisma.client.poll.create({
      data: {
        tripId,
        creatorId: userId,
        title: dto.title,
        description: dto.description,
        isMultipleChoice: dto.isMultipleChoice,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        options: {
          create: dto.options.map(opt => ({
            text: opt.text,
            imageUrl: opt.imageUrl,
          }))
        }
      },
      include: {
        options: true,
        creator: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      }
    });
  }

  async getPolls(userId: string, tripId: string) {
    await this.tripsService.findOne(userId, tripId);

    const polls = await this.prisma.client.poll.findMany({
      where: { tripId },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        options: {
          include: {
            votes: {
              include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }
            }
          }
        },
        comments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return polls;
  }

  async vote(userId: string, tripId: string, pollId: string, dto: PollVoteRequest) {
    await this.tripsService.findOne(userId, tripId);

    const poll = await this.prisma.client.poll.findUnique({
      where: { id: pollId },
      include: { options: true }
    });

    if (!poll) throw new NotFoundException("Poll not found");
    if (poll.tripId !== tripId) throw new BadRequestException("Poll does not belong to this trip");
    if (poll.status !== "OPEN") throw new BadRequestException("Poll is closed");

    // Option must exist in poll
    if (!poll.options.find(o => o.id === dto.optionId)) {
      throw new BadRequestException("Invalid option");
    }

    if (!poll.isMultipleChoice) {
      // Delete previous votes for this poll
      const existingOptions = poll.options.map(o => o.id);
      await this.prisma.client.pollVote.deleteMany({
        where: {
          userId,
          optionId: { in: existingOptions }
        }
      });
    } else {
      // Toggle vote for multiple choice
      const existingVote = await this.prisma.client.pollVote.findUnique({
        where: {
          pollId_userId_optionId: {
            pollId,
            userId,
            optionId: dto.optionId
          }
        }
      });

      if (existingVote) {
        await this.prisma.client.pollVote.delete({
          where: { id: existingVote.id }
        });
        return { success: true, action: 'removed' };
      }
    }

    await this.prisma.client.pollVote.create({
      data: {
        pollId,
        optionId: dto.optionId,
        userId
      }
    });

    return { success: true, action: 'added' };
  }

  async addComment(userId: string, tripId: string, pollId: string, dto: PollCommentRequest) {
    await this.tripsService.findOne(userId, tripId);

    const poll = await this.prisma.client.poll.findUnique({ where: { id: pollId } });
    if (!poll || poll.tripId !== tripId) throw new NotFoundException("Poll not found");

    return this.prisma.client.pollComment.create({
      data: {
        pollId,
        userId,
        content: dto.content
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      }
    });
  }
}
