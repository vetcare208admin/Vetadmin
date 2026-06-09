import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../../common/enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async getBranches() {
    return this.prisma.branch.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            users: true,
            appointments: true,
            invoices: true,
          },
        },
      },
    });
  }

  async createBranch(data: { name: string; address: string; phone: string; timezone?: string }) {
    return this.prisma.branch.create({ data });
  }

  async getAllUsers(role?: UserRole, branchId?: string) {
    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (branchId) where.branchId = branchId;

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        branchId: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(userId: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async deactivateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async getAuditLogs(filters?: { userId?: string; entity?: string; action?: string; dateFrom?: string; dateTo?: string }) {
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.action) where.action = filters.action;
    if (filters?.dateFrom || filters?.dateTo) {
      where.timestamp = {};
      if (filters.dateFrom) where.timestamp.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.timestamp.lte = new Date(filters.dateTo);
    }

    return this.prisma.auditLog.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { timestamp: 'desc' },
      take: 1000,
    });
  }

  async getAnalyticsOverview() {
    const [totalUsers, totalAppointments, totalInvoices, totalRevenue] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.appointment.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count({ where: { deletedAt: null } }),
      this.prisma.invoice.aggregate({
        where: { status: 'paid', deletedAt: null },
        _sum: { total: true },
      }),
    ]);

    return {
      totalUsers,
      totalAppointments,
      totalInvoices,
      totalRevenue: totalRevenue._sum.total ?? 0,
    };
  }

  async getBranchAnalytics(branchId: string) {
    const [appointments, revenue, users] = await Promise.all([
      this.prisma.appointment.count({ where: { branchId, deletedAt: null } }),
      this.prisma.invoice.aggregate({
        where: { branchId, status: 'paid', deletedAt: null },
        _sum: { total: true },
      }),
      this.prisma.user.count({ where: { branchId, deletedAt: null } }),
    ]);

    return {
      branchId,
      appointments,
      revenue: revenue._sum.total ?? 0,
      users,
    };
  }

  async broadcastNotification(data: {
    title: string;
    body: string;
    type: string;
    targetRole?: UserRole;
    targetBranchId?: string;
  }) {
    const where: any = {};
    if (data.targetRole) where.role = data.targetRole;
    if (data.targetBranchId) where.branchId = data.targetBranchId;

    const users = await this.prisma.user.findMany({ where, select: { id: true } });

    return this.prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        title: data.title,
        body: data.body,
        type: data.type as any,
        channel: 'in_app',
      })),
    });
  }
}
