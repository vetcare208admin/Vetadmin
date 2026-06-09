import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
    console.log('PrismaService instantiated');
  }

  async onModuleInit() {
    try {
      console.log('Connecting to Database...');
      await this.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('CRITICAL: Failed to connect to Database:', error.message);
      // Still not throwing to allow the app to bootstrap for diagnostics
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
