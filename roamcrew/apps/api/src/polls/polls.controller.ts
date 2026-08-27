import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes, BadRequestException } from '@nestjs/common';
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
    return this.pollsService.createPoll(req.user.userId, tripId, dto);
  }

  @Post('extract-link')
  extractLink(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body('url') url: string
  ) {
    if (!url) throw new BadRequestException("URL is required");
    return this.pollsService.extractLinkMetadata(req.user.userId, tripId, url);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('tripId') tripId: string
  ) {
    return this.pollsService.getPolls(req.user.userId, tripId);
  }

  @Post(':pollId/vote')
  @UsePipes(new ZodValidationPipe(PollVoteSchema))
  vote(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('pollId') pollId: string,
    @Body() dto: PollVoteRequest
  ) {
    return this.pollsService.vote(req.user.userId, tripId, pollId, dto);
  }

  @Post(':pollId/comments')
  @UsePipes(new ZodValidationPipe(PollCommentSchema))
  addComment(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('pollId') pollId: string,
    @Body() dto: PollCommentRequest
  ) {
    return this.pollsService.addComment(req.user.userId, tripId, pollId, dto);
  }
}
