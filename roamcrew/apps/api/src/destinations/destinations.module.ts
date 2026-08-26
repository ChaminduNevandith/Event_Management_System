import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [PrismaModule, TripsModule],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
