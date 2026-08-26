import { Module } from '@nestjs/common';
import { ItineraryItemsService } from './itinerary-items.service';
import { ItineraryItemsController } from './itinerary-items.controller';

@Module({
  providers: [ItineraryItemsService],
  controllers: [ItineraryItemsController]
})
export class ItineraryItemsModule {}
