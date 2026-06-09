import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus } from '../../../common/enums';

@Injectable()
export class VetService {
  constructor(private prisma: PrismaService) { }

  async getTodayAppointments(vetId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.appointment.findMany({
      where: {
        vetId,
        scheduledAt: {
          gte: today,
          lt: tomorrow,
        },
        status: { notIn: [AppointmentStatus.cancelled] },
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            customer: { select: { fullName: true, phone: true } }
          }
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async updateAppointmentStatus(
    vetId: string,
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, vetId },
    });

    if (!appointment) {
      throw new ForbiddenException('Appointment not found or not assigned to you');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  async createMedicalRecord(vetId: string, data: {
    petId: string;
    appointmentId?: string;
    visitDate: Date;
    chiefComplaint?: string;
    diagnosis?: string;
    notes?: string;
    followUpDate?: Date;
  }) {
    return this.prisma.medicalRecord.create({
      data: { ...data, vetId },
    });
  }

  async createPrescription(vetId: string, data: {
    medicalRecordId: string;
    drugName: string;
    dose: string;
    frequency: string;
    duration: string;
    notes?: string;
  }) {
    return this.prisma.prescription.create({
      data,
    });
  }

  async createLabOrder(vetId: string, data: {
    petId: string;
    tests: string[];
    priority?: string;
    notes?: string;
    medicalRecordId?: string;
  }) {
    return this.prisma.labOrder.create({
      data: {
        ...data,
        vetId,
        tests: JSON.stringify(data.tests)
      } as any,
    });
  }

  async getSchedule(vetId: string) {
    return this.prisma.vetSchedule.findMany({
      where: { vetId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async createScheduleBlock(vetId: string, data: {
    date: Date;
    startTime: string;
    endTime: string;
    reason: string;
  }) {
    return this.prisma.scheduleBlock.create({
      data: { ...data, vetId },
    });
  }

  async getPatientHistory(petId: string) {
    return this.prisma.medicalRecord.findMany({
      where: { petId },
      include: {
        prescriptions: true,
        labOrders: { include: { results: true } },
        radiologyFiles: true,
      },
      orderBy: { visitDate: 'desc' },
    });
  }
}
