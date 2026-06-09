import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('finance')
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ACCOUNTANT, UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Post('invoices')
  async createInvoice(@Body() data: any) {
    return this.financeService.createInvoice(data);
  }

  @Get('invoices')
  async findAllInvoices(@Query() filters: any) {
    return this.financeService.findAll(filters);
  }

  @Get('invoices/:id')
  async findInvoice(@Param('id') id: string) {
    return this.financeService.findById(id);
  }

  @Put('invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() data: any) {
    return this.financeService.update(id, data);
  }

  @Post('invoices/:id/send')
  async sendInvoice(@Param('id') id: string) {
    return this.financeService.sendInvoice(id);
  }

  @Post('payments')
  async recordPayment(@Body() data: any) {
    return this.financeService.recordPayment(data);
  }

  @Post('expenses')
  async recordExpense(@Body() data: any) {
    return this.financeService.recordExpense(data);
  }

  @Get('reports/revenue')
  async getRevenueReport(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string, @Query('branchId') branchId?: string) {
    return this.financeService.getRevenueReport(dateFrom, dateTo, branchId);
  }

  @Get('reports/outstanding')
  async getOutstandingInvoices() {
    return this.financeService.getOutstandingInvoices();
  }

  @Post('insurance-claims')
  async createInsuranceClaim(@Body() data: any) {
    return this.financeService.createInsuranceClaim(data);
  }

  @Get('price-catalog')
  async getPriceCatalog(@Query('branchId') branchId: string) {
    return this.financeService.getPriceCatalog(branchId);
  }

  @Get('overview')
  async getFinancialOverview(@Query('branchId') branchId?: string) {
    return this.financeService.getFinancialOverview(branchId);
  }
}
