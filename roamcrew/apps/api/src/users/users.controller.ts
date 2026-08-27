import { Controller, Get, Request, UseGuards, Patch, Body, Post, BadRequestException, Query } from '@nestjs/common';
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
  @Get('search')
  async searchUsers(@Request() req: any, @Query('q') q: string) {
    if (!q || q.length < 2) return [];
    return this.usersService.searchUsers(q, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    const allowedFields = [
      'firstName', 'lastName', 'displayName', 'avatarUrl', 'timezone', 
      'currency', 'language', 'username', 'bio', 'measurementUnits', 'dateFormat',
      'theme', 'reducedMotion', 'travelInterests', 'travelPace', 'dietaryPreferences',
      'accessibilityPrefs', 'isPrivate'
    ];
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
