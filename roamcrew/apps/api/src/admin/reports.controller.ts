import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportsService } from './reports.service';

// Public (authenticated) — submit a report
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  createReport(@Request() req: any, @Body() dto: any) {
    return this.reportsService.createReport(req.user.userId, dto);
  }
}

// Admin-only — manage reports
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getAllReports(@Query('status') status?: string) {
    return this.reportsService.getAllReports(status);
  }

  @Get('stats')
  getStats() {
    return this.reportsService.getReportStats();
  }

  @Patch(':id/resolve')
  resolveReport(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { status: 'RESOLVED' | 'DISMISSED' | 'REVIEWED'; resolvedNote?: string },
  ) {
    return this.reportsService.resolveReport(req.user.userId, id, dto);
  }
}
