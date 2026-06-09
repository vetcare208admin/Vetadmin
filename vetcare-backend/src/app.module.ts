import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { VetModule } from './modules/vet/vet.module';
import { LabModule } from './modules/lab/lab.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HrModule } from './modules/hr/hr.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FilesModule } from './modules/files/files.module';
import { QueueModule } from './modules/queue/queue.module';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: envValidationSchema,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute for authenticated users
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    // CustomersModule,
    // AppointmentsModule,
    // VetModule,
    // LabModule,
    // FinanceModule,
    // HrModule,
    // AdminModule,
    // NotificationsModule,
    // FilesModule,
    // QueueModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule { }
