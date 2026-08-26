import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateTransportSchema, UpdateTransportSchema } from 'contracts';
import type { CreateTransportRequest, UpdateTransportRequest } from 'contracts';

@Controller('trips/:tripId/transport')
@UseGuards(JwtAuthGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTransportSchema))
  create(
    @Param('tripId') tripId: string,
    @Body() createDto: CreateTransportRequest,
  ) {
    return this.transportService.create(tripId, createDto);
  }

  @Get()
  findAll(@Param('tripId') tripId: string) {
    return this.transportService.findAll(tripId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateTransportSchema))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTransportRequest,
  ) {
    return this.transportService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(id);
  }
}
