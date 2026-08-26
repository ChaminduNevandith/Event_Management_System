import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips/:tripId/messages')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessages(
    @Request() req: any,
    @Param('tripId') tripId: string,
  ) {
    return this.chatService.getMessagesForTrip(req.user.userId, tripId);
  }
}
