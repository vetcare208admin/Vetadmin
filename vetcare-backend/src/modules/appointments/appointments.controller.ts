import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(@Query() filters: any, @Req() req: any) {
    return this.appointmentsService.findAllForCustomer(req.user.id, filters);
  }

  @Post()
  async book(@Body() data: any, @Req() req: any) {
    return this.appointmentsService.bookAppointment(req.user.id, data);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Req() req: any) {
    return this.appointmentsService.cancelAppointment(id, req.user.id);
  }
}
