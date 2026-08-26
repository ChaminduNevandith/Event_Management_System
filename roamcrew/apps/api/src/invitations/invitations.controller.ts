import { Controller, Get, Post, Param, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async getPendingInvitations(@Request() req: any) {
    return this.invitationsService.getPendingInvitations(req.user.userId);
  }

  // Public endpoint to preview a link
  @Get(':token')
  async previewInvitation(@Param('token') token: string) {
    return this.invitationsService.previewInvitation(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  async acceptInvitation(@Request() req: any, @Param('token') token: string) {
    return this.invitationsService.acceptInvitation(req.user.userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('trip/:tripId')
  async createInvitation(
    @Request() req: any, 
    @Param('tripId') tripId: string, 
    @Body() body: { inviteeUsername?: string; role?: 'ADMIN' | 'MEMBER' | 'VIEWER'; maxUses?: number; expiresAt?: Date }
  ) {
    return this.invitationsService.createInvitation(req.user.userId, tripId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/revoke')
  async revokeInvitation(@Request() req: any, @Param('id') id: string) {
    return this.invitationsService.revokeInvitation(req.user.userId, id);
  }
}
