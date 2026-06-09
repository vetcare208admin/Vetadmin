import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.petsService.findAllForCustomer(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: any) {
    return this.petsService.findById(id, req.user.id);
  }

  @Post()
  async create(@Body() data: any, @Req() req: any) {
    return this.petsService.create(req.user.id, data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.petsService.update(id, req.user.id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.petsService.delete(id, req.user.id);
  }
}
