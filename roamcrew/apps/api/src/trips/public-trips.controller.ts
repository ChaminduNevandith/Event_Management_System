import { Controller, Get, Param } from '@nestjs/common';
import { TripsService } from './trips.service';

@Controller('public-trips')
export class PublicTripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get(':token')
  getPublicTrip(@Param('token') token: string) {
    return this.tripsService.getPublicTrip(token);
  }
}
