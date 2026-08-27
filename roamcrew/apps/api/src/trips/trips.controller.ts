import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, UsePipes, Delete, Query } from '@nestjs/common';
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
  findAll(@Request() req: any, @Query('isArchived') isArchived?: string, @Query('isTemplate') isTemplate?: string) {
    return this.tripsService.findAll(
      req.user.userId,
      isArchived === 'true' ? true : isArchived === 'false' ? false : undefined,
      isTemplate === 'true' ? true : isTemplate === 'false' ? false : undefined
    );
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

  @Post(':id/archive')
  archive(@Request() req: any, @Param('id') id: string) {
    return this.tripsService.setArchiveStatus(req.user.userId, id, true);
  }

  @Post(':id/restore')
  restore(@Request() req: any, @Param('id') id: string) {
    return this.tripsService.setArchiveStatus(req.user.userId, id, false);
  }

  @Post(':id/share')
  generateShareLink(@Request() req: any, @Param('id') id: string) {
    return this.tripsService.generatePublicToken(req.user.userId, id);
  }

  @Post(':id/template')
  setTemplate(@Request() req: any, @Param('id') id: string, @Body('isTemplate') isTemplate: boolean) {
    return this.tripsService.setTemplateStatus(req.user.userId, id, isTemplate);
  }

  @Post(':id/clone')
  clone(@Request() req: any, @Param('id') id: string, @Body('newTitle') newTitle: string) {
    return this.tripsService.cloneTrip(req.user.userId, id, newTitle);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.tripsService.remove(req.user.userId, id);
  }

  @Patch(':id/members/:userId/role')
  updateRole(
    @Request() req: any,
    @Param('id') tripId: string,
    @Param('userId') targetUserId: string,
    @Body('role') role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  ) {
    return this.tripsService.updateMemberRole(req.user.userId, tripId, targetUserId, role);
  }

  @Get(':id/activity')
  getActivity(@Request() req: any, @Param('id') tripId: string) {
    return this.tripsService.getActivity(req.user.userId, tripId);
  }
}
