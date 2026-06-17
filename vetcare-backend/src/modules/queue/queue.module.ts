import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { SmsProcessor } from './processors/sms.processor';

@Module({})
export class QueueModule {
  static forRoot(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const redisUrl = configService.get<string>('REDIS_URL');
            if (!redisUrl) {
              // No Redis configured — use offline/no-op mode.
              // This prevents Vercel serverless crashes when Redis is absent.
              return {
                redis: {
                  host: '127.0.0.1',
                  port: 6379,
                  maxRetriesPerRequest: 0,
                  enableReadyCheck: false,
                  lazyConnect: true,
                },
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
    };
  }
}
