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

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateItineraryItemSchema))
  update(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() dto: UpdateItineraryItemRequest
  ) {
    return this.itineraryService.update(req.user.id, tripId, id, dto);
  }
}
