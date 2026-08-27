import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(reporterId: string, dto: {
    contentType: string;
    contentId: string;
    reason: string;
    description?: string;
  }) {
    return this.prisma.client.report.create({
      data: {
        reporterId,
        contentType: dto.contentType,
        contentId: dto.contentId,
        reason: dto.reason as any,
        description: dto.description,
      },
    });
  }

  // Admin only
  async getAllReports(status?: string) {
    return this.prisma.client.report.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        reporter: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveReport(adminId: string, reportId: string, dto: {
    status: 'RESOLVED' | 'DISMISSED' | 'REVIEWED';
    resolvedNote?: string;
  }) {
    const report = await this.prisma.client.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.client.report.update({
      where: { id: reportId },
      data: {
        status: dto.status,
        resolvedBy: adminId,
        resolvedNote: dto.resolvedNote,
      },
    });
  }

  async getReportStats() {
    const [pending, reviewed, resolved, dismissed] = await Promise.all([
      this.prisma.client.report.count({ where: { status: 'PENDING' } }),
      this.prisma.client.report.count({ where: { status: 'REVIEWED' } }),
      this.prisma.client.report.count({ where: { status: 'RESOLVED' } }),
      this.prisma.client.report.count({ where: { status: 'DISMISSED' } }),
    ]);
    return { pending, reviewed, resolved, dismissed, total: pending + reviewed + resolved + dismissed };
  }
}
