import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreatePollSchema, PollVoteSchema, PollCommentSchema } from 'contracts';
import type { CreatePollRequest, PollVoteRequest, PollCommentRequest } from 'contracts';

@Controller('trips/:tripId/polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePollSchema))
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body() dto: CreatePollRequest
  ) {
    return this.pollsService.createPoll(req.user.id, tripId, dto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('tripId') tripId: string
  ) {
    return this.pollsService.getPolls(req.user.id, tripId);
  }

  @Post(':pollId/vote')
  @UsePipes(new ZodValidationPipe(PollVoteSchema))
  vote(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('pollId') pollId: string,
    @Body() dto: PollVoteRequest
  ) {
    return this.pollsService.vote(req.user.id, tripId, pollId, dto);
  }

  @Post(':pollId/comments')
  @UsePipes(new ZodValidationPipe(PollCommentSchema))
  addComment(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('pollId') pollId: string,
    @Body() dto: PollCommentRequest
  ) {
    return this.pollsService.addComment(req.user.id, tripId, pollId, dto);
  }
}
