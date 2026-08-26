import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, UsePipes } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { 
  CreateDestinationSchema, 
  UpdateDestinationSchema,
  DestinationVoteSchema 
} from 'contracts';
import type { 
  CreateDestinationRequest, 
  UpdateDestinationRequest,
  DestinationVoteRequest
} from 'contracts';

@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateDestinationSchema))
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body() createDestinationDto: CreateDestinationRequest
  ) {
    return this.destinationsService.create(req.user.userId, tripId, createDestinationDto);
  }

  @Get()
  findAll(@Request() req: any, @Param('tripId') tripId: string) {
    return this.destinationsService.findAll(req.user.userId, tripId);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateDestinationSchema))
  update(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateDestinationRequest
  ) {
    return this.destinationsService.update(req.user.userId, tripId, id, updateDto);
  }

  @Post(':id/vote')
  @UsePipes(new ZodValidationPipe(DestinationVoteSchema))
  vote(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() voteDto: DestinationVoteRequest
  ) {
    return this.destinationsService.vote(req.user.userId, tripId, id, voteDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('tripId') tripId: string, @Param('id') id: string) {
    return this.destinationsService.remove(req.user.userId, tripId, id);
  }
}
