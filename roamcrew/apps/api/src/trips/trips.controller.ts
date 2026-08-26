import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateTripSchema, UpdateTripSchema } from 'contracts';
import type { CreateTripRequest, UpdateTripRequest } from 'contracts';

@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTripSchema))
  create(@Request() req: any, @Body() createTripDto: CreateTripRequest) {
    return this.tripsService.create(req.user.userId, createTripDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.tripsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.tripsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateTripSchema))
  update(@Request() req: any, @Param('id') id: string, @Body() updateTripDto: UpdateTripRequest) {
    return this.tripsService.update(req.user.userId, id, updateTripDto);
  }
}
