import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        if (!cachedServer) {
            console.log('--- START BOOTSTRAP (v3-TS) ---');

            // Import from source, TypeScript will be handled by @vercel/node
            const { AppModule } = await import('../src/app.module');

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
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            tip: 'Check Vercel Build Logs and ensure all environment variables are set.'
        });
    }
};
