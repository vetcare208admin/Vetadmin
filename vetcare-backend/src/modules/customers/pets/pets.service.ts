import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async findAllForCustomer(customerUserId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.pet.findMany({
      where: { customerId: customer.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(petId: string, customerUserId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, customerId: customer.id, deletedAt: null },
      include: {
        medicalRecords: { orderBy: { visitDate: 'desc' } },
        labOrders: { orderBy: { orderedAt: 'desc' } },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async create(customerUserId: string, data: {
    name: string;
    species: string;
    breed?: string;
    dob?: Date;
    weight?: number;
    microchipNo?: string;
    photoUrl?: string;
  }) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.pet.create({
      data: { customerId: customer.id, ...data },
    });
  }

  async update(petId: string, customerUserId: string, data: any) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, customerId: customer.id },
    });

    if (!pet) {
      throw new ForbiddenException('You do not own this pet');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data,
    });
  }

  async delete(petId: string, customerUserId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, customerId: customer.id },
    });

    if (!pet) {
      throw new ForbiddenException('You do not own this pet');
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: { deletedAt: new Date() },
    });
  }
}
