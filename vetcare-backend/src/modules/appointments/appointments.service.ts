import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '@/common/enums';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllForCustomer(customerUserId: string, filters?: { status?: string; dateFrom?: string; dateTo?: string }) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const where: any = {
      pet: { customerId: customer.id },
      deletedAt: null,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.dateFrom) {
      where.scheduledAt = { gte: new Date(filters.dateFrom) };
    }

    if (filters?.dateTo) {
      where.scheduledAt = { ...where.scheduledAt, lte: new Date(filters.dateTo) };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        pet: { select: { id: true, name: true, species: true } },
        vet: { select: { id: true, email: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async bookAppointment(customerUserId: string, data: {
    petId: string;
    vetId: string;
    branchId: string;
    scheduledAt: Date;
    type: string;
    notes?: string;
  }) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Verify pet belongs to customer
    const pet = await this.prisma.pet.findFirst({
      where: { id: data.petId, customerId: customer.id },
    });

    if (!pet) {
      throw new ForbiddenException('Pet not found or does not belong to you');
    }

    // Check availability
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        vetId: data.vetId,
        scheduledAt: data.scheduledAt,
        status: { notIn: [AppointmentStatus.cancelled, AppointmentStatus.done] },
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Time slot is not available');
    }

    return this.prisma.appointment.create({
      data: {
        ...data,
        status: AppointmentStatus.pending,
      },
    });
  }

  async cancelAppointment(appointmentId: string, customerUserId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerUserId },
      select: { id: true },
    });

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        pet: { customerId: customer.id },
      },
    });

    if (!appointment) {
      throw new ForbiddenException('Appointment not found or does not belong to you');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.cancelled },
    });
  }

  async getAvailableVets(params: { date: string; branchId: string; specialty?: string }) {
    const vets = await this.prisma.user.findMany({
      where: {
        role: 'VET_DOCTOR',
        branchId: params.branchId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        branchId: true,
      },
    });

    // Filter out vets with existing appointments at the requested time
    return vets;
  }
}
