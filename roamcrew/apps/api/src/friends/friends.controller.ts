import { Controller, Get, Post, Delete, Param, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(@Request() req: any) {
    return this.friendsService.getFriends(req.user.userId);
  }

  @Get('requests/pending')
  async getPendingRequests(@Request() req: any) {
    return this.friendsService.getPendingRequests(req.user.userId);
  }

  @Post('request')
  async sendRequest(@Request() req: any, @Body() body: { targetUsername: string }) {
    return this.friendsService.sendRequest(req.user.userId, body.targetUsername);
  }

  @Post('accept/:id')
  async acceptRequest(@Request() req: any, @Param('id') requestId: string) {
    return this.friendsService.acceptRequest(req.user.userId, requestId);
  }

  @Post('decline/:id')
  async declineRequest(@Request() req: any, @Param('id') requestId: string) {
    return this.friendsService.declineRequest(req.user.userId, requestId);
  }

  @Delete(':friendId')
  async removeFriend(@Request() req: any, @Param('friendId') friendId: string) {
    return this.friendsService.removeFriend(req.user.userId, friendId);
  }
}
