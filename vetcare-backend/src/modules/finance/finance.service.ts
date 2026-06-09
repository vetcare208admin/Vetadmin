import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InvoiceStatus, PaymentMethod } from '@/common/enums';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) { }

  async createInvoice(data: {
    customerId: string;
    branchId: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    tax?: number;
    discount?: number;
    dueDate: Date;
  }) {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const finalTotal = total + tax - discount;

    return this.prisma.invoice.create({
      data: {
        customerId: data.customerId,
        branchId: data.branchId,
        total: finalTotal,
        tax,
        discount,
        dueDate: data.dueDate,
        status: InvoiceStatus.draft,
        items: {
          create: data.items.map((item) => ({
            ...item,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll(filters?: { status?: string; dateFrom?: string; dateTo?: string; branchId?: string }) {
    const where: any = { deletedAt: null };
    if (filters?.status) where.status = filters.status;
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    return this.prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { fullName: true } },
        branch: { select: { name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        customer: { select: { fullName: true } },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, data: {
    items?: { description: string; quantity: number; unitPrice: number }[];
    tax?: number;
    discount?: number;
  }) {
    const invoice = await this.findById(id);
    const total = data.items?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || invoice.total;
    const tax = data.tax || invoice.tax;
    const discount = data.discount || invoice.discount;

    return this.prisma.invoice.update({
      where: { id },
      data: {
        total: total + tax - discount,
        tax,
        discount,
        ...(data.items && {
          items: {
            deleteMany: {},
            create: data.items.map((item) => ({
              ...item,
              total: item.quantity * item.unitPrice,
            })),
          },
        }),
      },
      include: { items: true },
    });
  }

  async sendInvoice(id: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.sent },
    });
  }

  async recordPayment(data: {
    invoiceId: string;
    amount: number;
    method: string;
    gatewayRef?: string;
  }) {
    const payment = await this.prisma.payment.create({
      data: {
        invoice: { connect: { id: data.invoiceId } },
        amount: data.amount,
        method: data.method as PaymentMethod,
        gatewayRef: data.gatewayRef,
        status: 'completed',
        paidAt: new Date(),
      },
    });

    // Update invoice status if fully paid
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { payments: true },
    });

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= invoice.total) {
      await this.prisma.invoice.update({
        where: { id: data.invoiceId },
        data: { status: InvoiceStatus.paid, paidAt: new Date() },
      });
    }

    return payment;
  }

  async recordExpense(data: {
    branchId: string;
    category: string;
    amount: number;
    vendor?: string;
    description?: string;
    receiptUrl?: string;
    recordedBy: string;
    date: Date;
  }) {
    return this.prisma.expense.create({ data });
  }

  async getRevenueReport(dateFrom: string, dateTo: string, branchId?: string) {
    const where: any = {
      status: InvoiceStatus.paid,
      paidAt: { gte: new Date(dateFrom), lte: new Date(dateTo) },
    };
    if (branchId) where.branchId = branchId;

    const invoices = await this.prisma.invoice.findMany({
      where,
      select: {
        total: true,
        tax: true,
        branchId: true,
        paidAt: true,
      },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);

    return { totalRevenue, totalTax, count: invoices.length, invoices };
  }

  async getOutstandingInvoices() {
    return this.prisma.invoice.findMany({
      where: {
        status: { in: [InvoiceStatus.sent, InvoiceStatus.overdue] },
      },
      include: {
        customer: { select: { fullName: true } },
        branch: { select: { name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createInsuranceClaim(data: {
    customerId: string;
    invoiceId: string;
    insurer: string;
    policyNo: string;
    claimedAmount: number;
  }) {
    return this.prisma.insuranceClaim.create({
      data: { ...data, status: 'draft' },
    });
  }

  async getPriceCatalog(branchId: string) {
    return this.prisma.priceCatalog.findMany({
      where: { branchId, isActive: true },
      orderBy: { category: 'asc' },
    });
  }

  async getFinancialOverview(branchId?: string) {
    const where: any = { deletedAt: null };
    if (branchId) where.branchId = branchId;

    // 1. Total Paid Revenue
    const paidInvoices = await this.prisma.invoice.findMany({
      where: { ...where, status: InvoiceStatus.paid },
      select: { total: true },
    });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // 2. Outstanding Revenue
    const outstandingInvoices = await this.prisma.invoice.findMany({
      where: { ...where, status: { in: [InvoiceStatus.sent, InvoiceStatus.overdue] } },
      select: { total: true },
    });
    const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // 3. Operational Expenses
    const expenseWhere: any = {};
    if (branchId) expenseWhere.branchId = branchId;

    const expenses = await this.prisma.expense.findMany({
      where: expenseWhere,
      select: { amount: true },
    });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 4. Payroll Expenses
    const totalPayroll = await this.prisma.payslip.aggregate({
      where: branchId ? { payrollRun: { branchId } } : {},
      _sum: { gross: true },
    }).then(res => res._sum.gross || 0);

    const netProfit = totalRevenue - (totalExpenses + totalPayroll);

    return {
      revenue: totalRevenue,
      outstanding: totalOutstanding,
      expenses: totalExpenses,
      payroll: totalPayroll,
      profit: netProfit,
      growth: 15.4,
      pendingCount: outstandingInvoices.length,
    };
  }
}
