import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        if (!cachedServer) {
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
        }

        return cachedServer(req, res);
    } catch (error: any) {
        console.error('CRITICAL: Serverless bootstrap error:', error);
        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack,
            tip: 'Check Vercel Build Logs and ensure all environment variables are set.'
        });
    }
};
