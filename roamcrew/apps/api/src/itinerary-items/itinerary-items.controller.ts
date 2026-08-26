import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ItineraryItemsService } from './itinerary-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateItineraryItemSchema, UpdateItineraryItemSchema } from 'contracts';

@Controller('trips/:tripId')
@UseGuards(JwtAuthGuard)
export class ItineraryItemsController {
  constructor(private readonly itineraryItemsService: ItineraryItemsService) {}

  @Post('destinations/:destId/items')
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('destId') destId: string,
    @Body(new ZodValidationPipe(CreateItineraryItemSchema)) createDto: any,
  ) {
    return this.itineraryItemsService.create(req.user.userId, tripId, destId, createDto);
  }

  @Put('items/:itemId')
  update(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('itemId') itemId: string,
    @Body(new ZodValidationPipe(UpdateItineraryItemSchema)) updateDto: any,
  ) {
    return this.itineraryItemsService.update(req.user.userId, tripId, itemId, updateDto);
  }

  @Delete('items/:itemId')
  remove(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.itineraryItemsService.remove(req.user.userId, tripId, itemId);
  }
}
