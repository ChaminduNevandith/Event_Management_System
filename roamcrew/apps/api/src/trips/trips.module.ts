import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PublicTripsController } from './public-trips.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TripsController, PublicTripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
