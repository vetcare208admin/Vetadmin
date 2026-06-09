import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaveStatus, LeaveType } from '../../common/enums';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) { }

  async findAllStaff(branchId?: string) {
    const where: any = { deletedAt: null };
    if (branchId) {
      where.user = { branchId };
    }

    return this.prisma.staff.findMany({
      where,
      include: {
        user: { select: { email: true, role: true, isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findStaffById(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, role: true } },
        attendance: { orderBy: { date: 'desc' }, take: 30 },
        certifications: true,
        leaveRequests: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  async getAttendance(staffId: string, dateFrom?: string, dateTo?: string) {
    const where: any = { staffId };
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async clockIn(data: { staffId: string; date: Date; clockIn: Date }) {
    return this.prisma.attendance.create({
      data: {
        staffId: data.staffId,
        date: data.date,
        clockIn: data.clockIn,
        status: 'present',
      },
    });
  }

  async clockOut(staffId: string, clockOut: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: { staffId, date: { gte: today } },
    });

    if (!attendance) {
      throw new NotFoundException('No clock-in record found for today');
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut },
    });
  }

  async createLeaveRequest(data: {
    staffId: string;
    type: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }) {
    return this.prisma.leaveRequest.create({
      data: {
        staff: { connect: { id: data.staffId } },
        type: data.type as LeaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      },
    });
  }

  async getLeaveRequests(branchId?: string) {
    const where: any = {};
    if (branchId) {
      where.staff = { user: { branchId } };
    }

    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        staff: { include: { user: { select: { email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveLeaveRequest(id: string, approvedBy: string, status: LeaveStatus) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status, approvedBy, approvedAt: new Date() },
    });
  }

  async runPayroll(data: {
    branchId: string;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    payslips: { staffId: string; gross: number; deductions: any; net: number }[];
  }) {
    const totalGross = data.payslips.reduce((sum, p) => sum + p.gross, 0);
    const totalNet = data.payslips.reduce((sum, p) => sum + p.net, 0);

    const payrollRun = await this.prisma.payrollRun.create({
      data: {
        branchId: data.branchId,
        payPeriodStart: data.payPeriodStart,
        payPeriodEnd: data.payPeriodEnd,
        totalGross,
        totalNet,
        status: 'approved',
      },
    });

    const payslips = await Promise.all(
      data.payslips.map((p) =>
        this.prisma.payslip.create({
          data: {
            payrollRunId: payrollRun.id,
            staffId: p.staffId,
            gross: p.gross,
            deductions: JSON.stringify(p.deductions),
            net: p.net,
          },
        }),
      ),
    );

    return { payrollRun, payslips };
  }

  async getPayslips(staffId: string) {
    return this.prisma.payslip.findMany({
      where: { staffId },
      include: { payrollRun: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCertification(data: {
    staffId: string;
    certName: string;
    issuer: string;
    issuedDate: Date;
    expiryDate?: Date;
    fileUrl?: string;
  }) {
    return this.prisma.certification.create({ data });
  }

  async getExpiringCertifications(daysBefore: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBefore);

    return this.prisma.certification.findMany({
      where: {
        expiryDate: { lte: expiryDate, gte: new Date() },
      },
      include: {
        staff: { include: { user: { select: { email: true } } } },
      },
    });
  }

  async createJobPosting(data: {
    branchId: string;
    title: string;
    department: string;
    description: string;
    requirements?: string;
  }) {
    return this.prisma.jobPosting.create({
      data: { ...data, status: 'published', postedAt: new Date() },
    });
  }

  async getJobPostings(branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;

    return this.prisma.jobPosting.findMany({
      where,
      include: { applicants: true },
      orderBy: { postedAt: 'desc' },
    });
  }

  async createApplicant(data: {
    jobPostingId: string;
    fullName: string;
    email: string;
    resumeUrl: string;
  }) {
    return this.prisma.applicant.create({ data });
  }
}
