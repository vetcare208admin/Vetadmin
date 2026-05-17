import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { SmsProcessor } from './processors/sms.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        // If Redis URL is provided, use it as the redis connection string
        // Otherwise, fall back to a simple limiter configuration
        return redisUrl 
          ? { redis: redisUrl as string }
          : { limiter: { max: 10, duration: 1000 } };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'notifications' },
      { name: 'reports' },
    ),
  ],
  providers: [QueueService, EmailProcessor, SmsProcessor],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
