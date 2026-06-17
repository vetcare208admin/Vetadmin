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
    // We intentionally DON'T await this.$connect() here.
    // NestJS bootstrap will continue immediately.
    // Prisma will connect automatically on the first query.
    console.log('PrismaService: Bootstrap complete (lazy connection enabled)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
