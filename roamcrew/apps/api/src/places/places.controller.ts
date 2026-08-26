import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, UsePipes, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { 
  CreatePlaceSchema, 
  UpdatePlaceSchema 
} from 'contracts';
import type { 
  CreatePlaceRequest, 
  UpdatePlaceRequest 
} from 'contracts';

@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePlaceSchema))
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body() createDto: CreatePlaceRequest
  ) {
    return this.placesService.create(req.user.userId, tripId, createDto);
  }

  @Get()
  findAll(
    @Request() req: any, 
    @Param('tripId') tripId: string,
    @Query('destinationId') destinationId?: string
  ) {
    return this.placesService.findAll(req.user.userId, tripId, destinationId);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdatePlaceSchema))
  update(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdatePlaceRequest
  ) {
    return this.placesService.update(req.user.userId, tripId, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('tripId') tripId: string, @Param('id') id: string) {
    return this.placesService.remove(req.user.userId, tripId, id);
  }
}
