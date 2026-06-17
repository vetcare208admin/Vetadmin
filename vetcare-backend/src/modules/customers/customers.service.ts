import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, role: true } },
        pets: { where: { deletedAt: null } },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return customer;
  }

  async updateProfile(userId: string, data: { fullName?: string; phone?: string; address?: string; emergencyContact?: string }) {
    return this.prisma.customer.update({
      where: { userId },
      data,
    });
  }

  async createCustomer(userId: string, data: { fullName: string; phone: string; address?: string }) {
    const existing = await this.prisma.customer.findUnique({ where: { userId } });
    if (existing) {
      throw new BadRequestException('Customer profile already exists');
    }

    return this.prisma.customer.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}
