import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to Database:', error.message);
      // We don't rethrow here to allow the server to start (for diagnostic purposes)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
