import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        if (!cachedServer) {
            console.log('--- START BOOTSTRAP (ROOT-API-v1) ---');

            // POINT INTO THE BACKEND SUB-PROJECT
            const { AppModule } = await import('../vetcare-backend/src/app.module');

            const app = await NestFactory.create(AppModule, {
                logger: ['error', 'warn', 'log'],
            });

            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                }),
            );

            app.enableCors({
                origin: '*',
                credentials: true,
            });

            app.setGlobalPrefix('v1');

            await app.init();

            cachedServer = app.getHttpAdapter().getInstance();
            console.log('--- BOOTSTRAP SUCCESS ---');
        }

        return cachedServer(req, res);
    } catch (error: any) {
        console.error('--- BOOTSTRAP CRITICAL ERROR ---');

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            at: 'root/api/index.ts'
        });
    }
};
