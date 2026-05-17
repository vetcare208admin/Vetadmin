import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VetService } from './vet.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, AppointmentStatus } from '@/common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vet')
@Controller('vet')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VET_DOCTOR)
@ApiBearerAuth('JWT-auth')
export class VetController {
  constructor(private readonly vetService: VetService) {}

  @Get('appointments/today')
  async getTodayAppointments(@Req() req: any) {
    return this.vetService.getTodayAppointments(req.user.id);
  }

  @Put('appointments/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.vetService.updateAppointmentStatus(req.user.id, id, status as AppointmentStatus);
  }

  @Post('medical-records')
  async createMedicalRecord(@Body() data: any, @Req() req: any) {
    return this.vetService.createMedicalRecord(req.user.id, data);
  }

  @Post('prescriptions')
  async createPrescription(@Body() data: any, @Req() req: any) {
    return this.vetService.createPrescription(req.user.id, data);
  }

  @Post('lab-orders')
  async createLabOrder(@Body() data: any, @Req() req: any) {
    return this.vetService.createLabOrder(req.user.id, data);
  }

  @Get('schedule')
  async getSchedule(@Req() req: any) {
    return this.vetService.getSchedule(req.user.id);
  }

  @Post('schedule/block')
  async createScheduleBlock(@Body() data: any, @Req() req: any) {
    return this.vetService.createScheduleBlock(req.user.id, data);
  }

  @Get('patients/:petId/history')
  async getPatientHistory(@Param('petId') petId: string) {
    return this.vetService.getPatientHistory(petId);
  }
}
