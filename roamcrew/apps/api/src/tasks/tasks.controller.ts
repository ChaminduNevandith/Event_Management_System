import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips/:tripId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('tripId') tripId: string,
    @Request() req: any,
    @Body() data: any
  ) {
    return this.tasksService.create(tripId, req.user.userId, data);
  }

  @Get()
  findAll(
    @Param('tripId') tripId: string,
    @Request() req: any
  ) {
    return this.tasksService.findAll(tripId, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Request() req: any,
    @Body() data: any
  ) {
    return this.tasksService.update(tripId, id, req.user.userId, data);
  }

  @Delete(':id')
  remove(
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.tasksService.remove(tripId, id, req.user.userId);
  }
}
