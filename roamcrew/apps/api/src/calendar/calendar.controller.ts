import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(@Request() req: any) {
    return this.calendarService.getEventsForUser(req.user.userId);
  }
}
