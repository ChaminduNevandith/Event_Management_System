import { Controller, Get, Patch, Param, UseGuards, Request, HttpCode, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Request() req: any) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Patch('read-all')
  @HttpCode(200)
  async markAllAsRead(@Request() req: any) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true };
  }

  @Patch(':id/read')
  @HttpCode(200)
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id);
  }

  // --- Settings ---
  @Get('settings')
  async getSettings(@Request() req: any) {
    return this.notificationsService.getSettings(req.user.userId);
  }

  @Patch('settings')
  async updateSettings(@Request() req: any, @Body() body: any) {
    return this.notificationsService.updateSettings(req.user.userId, body);
  }

  // --- Push Subscriptions ---
  @Post('push/subscribe')
  async subscribePush(@Request() req: any, @Body() body: any) {
    return this.notificationsService.subscribePush(req.user.userId, body);
  }

  @Post('push/unsubscribe')
  @HttpCode(200)
  async unsubscribePush(@Request() req: any, @Body('endpoint') endpoint: string) {
    return this.notificationsService.unsubscribePush(req.user.userId, endpoint);
  }
}
