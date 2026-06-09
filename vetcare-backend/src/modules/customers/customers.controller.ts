import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    return this.customersService.getProfile(req.user.id);
  }

  @Put('me')
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.customersService.updateProfile(req.user.id, data);
  }
}
