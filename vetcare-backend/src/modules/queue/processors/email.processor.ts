import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process()
  async handleEmailJob(job: Job) {
    this.logger.log(`Processing email job ${job.id} for ${job.data.to}`);
    // Implement email sending logic here
    // Using Nodemailer or SendGrid
  }
}
