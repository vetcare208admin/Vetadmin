import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LabOrderStatus, LabResultFlag } from '../../common/enums';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  async getOrders(branchId?: string) {
    return this.prisma.labOrder.findMany({
      where: {
        status: { in: [LabOrderStatus.pending, LabOrderStatus.in_progress] },
      },
      include: {
        pet: { select: { name: true, species: true } },
        vet: { select: { email: true } },
        samples: true,
      },
      orderBy: [{ priority: 'asc' }, { orderedAt: 'asc' }],
    });
  }

  async acceptOrder(orderId: string) {
    return this.prisma.labOrder.update({
      where: { id: orderId },
      data: { status: LabOrderStatus.in_progress },
    });
  }

  async registerSample(data: {
    orderId: string;
    sampleType: string;
    barcode: string;
    collectedBy?: string;
  }) {
    return this.prisma.labSample.create({
      data: { ...data, status: 'collected' },
    });
  }

  async findByBarcode(barcode: string) {
    const sample = await this.prisma.labSample.findUnique({
      where: { barcode },
      include: { order: { include: { pet: true } } },
    });

    if (!sample) {
      throw new NotFoundException('Sample not found');
    }

    return sample;
  }

  async enterResult(data: {
    orderId: string;
    sampleId?: string;
    testName: string;
    value: string;
    unit?: string;
    refRange?: string;
  }) {
    // Auto-flag logic
    let flag: LabResultFlag = LabResultFlag.normal;
    if (data.refRange && data.value) {
      // Simple flag logic - compare value against reference range
      flag = this.calculateFlag(data.value, data.refRange) as LabResultFlag;
    }

    return this.prisma.labResult.create({
      data: { ...data, flag },
    });
  }

  async verifyResult(resultId: string, verifiedBy: string) {
    return this.prisma.labResult.update({
      where: { id: resultId },
      data: { verifiedBy, verifiedAt: new Date() },
    });
  }

  async dispatchResult(orderId: string) {
    return this.prisma.labOrder.update({
      where: { id: orderId },
      data: { status: LabOrderStatus.dispatched },
    });
  }

  async getInventory(branchId: string) {
    return this.prisma.labInventory.findMany({
      where: { branchId },
      orderBy: { itemName: 'asc' },
    });
  }

  async updateInventory(itemId: string, data: { quantity?: number; reorderLevel?: number }) {
    return this.prisma.labInventory.update({
      where: { id: itemId },
      data,
    });
  }

  private calculateFlag(value: string, refRange: string): LabResultFlag {
    // Parse reference range (e.g., "5.0-10.0")
    const [low, high] = refRange.split('-').map(Number);
    const numValue = parseFloat(value);

    if (isNaN(numValue) || isNaN(low) || isNaN(high)) {
      return LabResultFlag.normal;
    }

    if (numValue < low) return LabResultFlag.low;
    if (numValue > high) return LabResultFlag.high;
    return LabResultFlag.normal;
  }
}
