import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateAccommodationSchema, UpdateAccommodationSchema } from 'contracts';
import type { CreateAccommodationRequest, UpdateAccommodationRequest } from 'contracts';

@Controller('trips/:tripId/accommodations')
@UseGuards(JwtAuthGuard)
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateAccommodationSchema))
  create(
    @Param('tripId') tripId: string,
    @Body() createDto: CreateAccommodationRequest,
  ) {
    return this.accommodationsService.create(tripId, createDto);
  }

  @Get()
  findAll(@Param('tripId') tripId: string) {
    return this.accommodationsService.findAll(tripId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accommodationsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateAccommodationSchema))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAccommodationRequest,
  ) {
    return this.accommodationsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accommodationsService.remove(id);
  }
}
