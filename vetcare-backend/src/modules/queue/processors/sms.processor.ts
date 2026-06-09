import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('sms')
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);

  @Process()
  async handleSmsJob(job: Job) {
    this.logger.log(`Processing SMS job ${job.id} for ${job.data.to}`);
    // Implement SMS sending logic here
    // Using Twilio
  }
}
