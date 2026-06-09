import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LabService } from './lab.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('lab')
@Controller('lab')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LAB_TECH, UserRole.VET_DOCTOR, UserRole.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Get('orders')
  async getOrders(@Query('branchId') branchId?: string) {
    return this.labService.getOrders(branchId);
  }

  @Put('orders/:id/accept')
  async acceptOrder(@Param('id') id: string) {
    return this.labService.acceptOrder(id);
  }

  @Post('samples')
  async registerSample(@Body() data: any) {
    return this.labService.registerSample(data);
  }

  @Get('samples/:barcode')
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.labService.findByBarcode(barcode);
  }

  @Post('results')
  async enterResult(@Body() data: any) {
    return this.labService.enterResult(data);
  }

  @Put('results/:id/verify')
  async verifyResult(@Param('id') id: string, @Req() req: any) {
    return this.labService.verifyResult(id, req.user.id);
  }

  @Post('results/:id/dispatch')
  async dispatchResult(@Param('id') id: string) {
    return this.labService.dispatchResult(id);
  }

  @Get('inventory')
  async getInventory(@Query('branchId') branchId: string) {
    return this.labService.getInventory(branchId);
  }

  @Put('inventory/:id')
  async updateInventory(@Param('id') id: string, @Body() data: any) {
    return this.labService.updateInventory(id, data);
  }
}
