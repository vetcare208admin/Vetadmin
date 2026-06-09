import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('branches')
  async getBranches() {
    return this.adminService.getBranches();
  }

  @Post('branches')
  async createBranch(@Body() data: any) {
    return this.adminService.createBranch(data);
  }

  @Get('users')
  async getAllUsers(@Query('role') role?: UserRole, @Query('branchId') branchId?: string) {
    return this.adminService.getAllUsers(role, branchId);
  }

  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(id, role);
  }

  @Put('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Get('audit-logs')
  async getAuditLogs(@Query() filters: any) {
    return this.adminService.getAuditLogs(filters);
  }

  @Get('analytics/overview')
  async getAnalyticsOverview() {
    return this.adminService.getAnalyticsOverview();
  }

  @Get('analytics/branch/:id')
  async getBranchAnalytics(@Param('id') id: string) {
    return this.adminService.getBranchAnalytics(id);
  }

  @Post('notifications/broadcast')
  async broadcastNotification(@Body() data: any) {
    return this.adminService.broadcastNotification(data);
  }
}
