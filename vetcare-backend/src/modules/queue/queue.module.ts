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
        if (!redisUrl) {
          // If no Redis URL is provided, we return a configuration that doesn't 
          // attempt to connect to a real Redis, or we disable the queue.
          // Bull requires a connection by default, so we use a dummy one if needed
          // or just provide the limiter.
          return {
            redis: {
              host: 'localhost',
              port: 6379,
              maxRetriesPerRequest: 0,
              enableReadyCheck: false,
            }
          };
        }
        return { redis: redisUrl as string };
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
export class QueueModule { }
