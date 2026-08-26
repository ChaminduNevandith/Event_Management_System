import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CirclesService } from './circles.service';

@Controller('circles')
@UseGuards(JwtAuthGuard)
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @Post()
  async createCircle(@Request() req: any, @Body() body: { name: string; description?: string; imageUrl?: string }) {
    return this.circlesService.createCircle(req.user.userId, body);
  }

  @Get()
  async getMyCircles(@Request() req: any) {
    return this.circlesService.getMyCircles(req.user.userId);
  }

  @Get(':id')
  async getCircleById(@Request() req: any, @Param('id') id: string) {
    return this.circlesService.getCircleById(req.user.userId, id);
  }

  @Post(':id/members')
  async addMember(@Request() req: any, @Param('id') id: string, @Body() body: { username: string }) {
    return this.circlesService.addMember(req.user.userId, id, body.username);
  }

  @Delete(':id/members/:memberId')
  async removeMember(@Request() req: any, @Param('id') id: string, @Param('memberId') memberId: string) {
    return this.circlesService.removeMember(req.user.userId, id, memberId);
  }
}
