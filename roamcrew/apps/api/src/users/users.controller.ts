import { Controller, Get, Request, UseGuards, Patch, Body, Post, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findOne({ id: req.user.userId });
    if (user) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const allowedFields = ['firstName', 'lastName', 'displayName', 'avatarUrl', 'timezone', 'currency', 'language', 'username', 'bio', 'measurementUnits', 'dateFormat'];
    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    const updatedUser = await this.usersService.updateUser(req.user.userId, updateData);
    const { passwordHash, ...result } = updatedUser;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/password')
  async changePassword(@Request() req: any, @Body() body: any) {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Old and new password are required');
    }
    await this.usersService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
    return { success: true };
  }
}
