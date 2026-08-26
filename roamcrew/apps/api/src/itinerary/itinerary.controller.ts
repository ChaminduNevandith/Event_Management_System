import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateItineraryItemSchema } from 'contracts';
import type { CreateItineraryItemRequest } from 'contracts';

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
    return this.itineraryService.create(req.user.id, tripId, dto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('tripId') tripId: string
  ) {
    return this.itineraryService.findAll(req.user.id, tripId);
  }

  @Delete(':id')
  remove(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string
  ) {
    return this.itineraryService.remove(req.user.id, tripId, id);
  }
}
