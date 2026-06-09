import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// AppModule is imported lazily inside the handler

let cachedServer: any;

export default async (req: any, res: any) => {
    // DIAGNOSTIC FALLBACK: If we can't bootstrap NestJS, we return a simple express response
    if (req.url === '/v1/ping-express') {
        return res.status(200).json({
            status: 'express-ok',
            message: 'Vercel Node runtime is working',
            nodeVersion: process.version,
            env: process.env.NODE_ENV
        });
    }

    try {
        if (!cachedServer) {
            console.log('Bootstrapping NestJS for Vercel...');

            // Lazy load AppModule to catch top-level module errors
            const { AppModule } = await import('./src/app.module');

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

            console.log('Initializing app...');
            await app.init();
            console.log('App initialized successfully');

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
// Triggering production build v2
