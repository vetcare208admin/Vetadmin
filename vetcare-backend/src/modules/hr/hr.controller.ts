import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, LeaveStatus } from '../../../common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('hr')
@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.HR_MANAGER, UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('staff')
  async findAllStaff(@Query('branchId') branchId?: string) {
    return this.hrService.findAllStaff(branchId);
  }

  @Get('staff/:id')
  async findStaffById(@Param('id') id: string) {
    return this.hrService.findStaffById(id);
  }

  @Get('staff/:id/attendance')
  async getAttendance(@Param('id') id: string, @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return this.hrService.getAttendance(id, dateFrom, dateTo);
  }

  @Post('attendance/clock-in')
  async clockIn(@Body() data: any) {
    return this.hrService.clockIn(data);
  }

  @Post('attendance/clock-out')
  async clockOut(@Req() req: any) {
    return this.hrService.clockOut(req.user.id, new Date());
  }

  @Post('leave-requests')
  async createLeaveRequest(@Body() data: any) {
    return this.hrService.createLeaveRequest(data);
  }

  @Get('leave-requests')
  async getLeaveRequests(@Query('branchId') branchId?: string) {
    return this.hrService.getLeaveRequests(branchId);
  }

  @Put('leave-requests/:id/approve')
  async approveLeaveRequest(@Param('id') id: string, @Body('status') status: LeaveStatus, @Req() req: any) {
    return this.hrService.approveLeaveRequest(id, req.user.id, status);
  }

  @Post('payroll/run')
  async runPayroll(@Body() data: any) {
    return this.hrService.runPayroll(data);
  }

  @Get('payslips/:staffId')
  async getPayslips(@Param('staffId') staffId: string) {
    return this.hrService.getPayslips(staffId);
  }

  @Post('certifications')
  async createCertification(@Body() data: any) {
    return this.hrService.createCertification(data);
  }

  @Get('certifications')
  async getExpiringCertifications(@Query('daysBefore') daysBefore?: number) {
    return this.hrService.getExpiringCertifications(daysBefore);
  }

  @Post('job-postings')
  async createJobPosting(@Body() data: any) {
    return this.hrService.createJobPosting(data);
  }

  @Get('job-postings')
  async getJobPostings(@Query('branchId') branchId?: string) {
    return this.hrService.getJobPostings(branchId);
  }

  @Post('applicants')
  async createApplicant(@Body() data: any) {
    return this.hrService.createApplicant(data);
  }
}
