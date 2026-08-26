import { Controller, Post, Delete, Param, Body, UseGuards, Request, UsePipes } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateDestinationSchema } from 'contracts';
import type { CreateDestinationRequest } from 'contracts';

@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateDestinationSchema))
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body() createDestinationDto: CreateDestinationRequest
  ) {
    return this.destinationsService.create(req.user.userId, tripId, createDestinationDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('tripId') tripId: string, @Param('id') id: string) {
    return this.destinationsService.remove(req.user.userId, tripId, id);
  }
}
