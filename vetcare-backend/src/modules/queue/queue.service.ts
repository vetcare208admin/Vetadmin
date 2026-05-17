import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('sms') private smsQueue: Queue,
    @InjectQueue('notifications') private notificationQueue: Queue,
    @InjectQueue('reports') private reportQueue: Queue,
  ) {}

  async sendEmail(to: string, subject: string, html: string) {
    return this.emailQueue.add({ to, subject, html });
  }

  async sendSms(to: string, message: string) {
    return this.smsQueue.add({ to, message });
  }

  async sendNotification(userId: string, type: string, title: string, body: string) {
    return this.notificationQueue.add({ userId, type, title, body });
  }

  async generateReport(reportType: string, params: any) {
    return this.reportQueue.add({ reportType, params });
  }
}
