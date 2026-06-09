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
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,
    UsersModule,
    CustomersModule,
    AppointmentsModule,
    VetModule,
    LabModule,
    FinanceModule,
    HrModule,
    AdminModule,
    NotificationsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule { }
