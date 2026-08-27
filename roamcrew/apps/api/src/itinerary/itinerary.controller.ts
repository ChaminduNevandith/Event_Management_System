import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateItineraryItemSchema, UpdateItineraryItemSchema } from 'contracts';
import type { CreateItineraryItemRequest, UpdateItineraryItemRequest } from 'contracts';

@Controller('trips/:tripId/itinerary')
@UseGuards(JwtAuthGuard)
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateItineraryItemSchema))
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body() dto: CreateItineraryItemRequest
  ) {
    return this.itineraryService.create(req.user.userId, tripId, dto);
  }

  @Post('auto-schedule')
  autoSchedule(
    @Request() req: any,
    @Param('tripId') tripId: string
  ) {
    return this.itineraryService.autoSchedule(req.user.userId, tripId);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('tripId') tripId: string
  ) {
    return this.itineraryService.findAll(req.user.userId, tripId);
  }

  @Delete(':id')
  remove(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string
  ) {
    return this.itineraryService.remove(req.user.userId, tripId, id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateItineraryItemSchema))
  update(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() dto: UpdateItineraryItemRequest
  ) {
    return this.itineraryService.update(req.user.userId, tripId, id, dto);
  }
}
