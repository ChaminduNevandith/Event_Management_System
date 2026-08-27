import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PublicTripsController } from './public-trips.controller';

@Module({
  controllers: [TripsController, PublicTripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
