import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [PrismaModule, TripsModule],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
