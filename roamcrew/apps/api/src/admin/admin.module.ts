import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ReportsService } from './reports.service';
import { ReportsController, AdminReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController, ReportsController, AdminReportsController],
  providers: [AdminService, ReportsService],
})
export class AdminModule {}

