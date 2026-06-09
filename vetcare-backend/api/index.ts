import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        console.log('--- ENTER HANDLER ---');

        if (!cachedServer) {
            console.log('--- START LAZY BOOTSTRAP ---');

            console.log('Step 1: Lazy importing AppModule...');
            const { AppModule } = await import('../src/app.module');
            console.log('Step 1: Done');

            console.log('Step 2: NestFactory.create...');
            const app = await NestFactory.create(AppModule, {
                logger: ['error', 'warn', 'log'],
            });
            console.log('Step 2: Done');

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

            console.log('Step 3: app.init...');
            await app.init();
            console.log('Step 3: Done');

            cachedServer = app.getHttpAdapter().getInstance();
            console.log('--- BOOTSTRAP SUCCESS ---');
        }

        return cachedServer(req, res);
    } catch (error: any) {
        console.error('--- BOOTSTRAP CRITICAL ERROR ---');
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack,
            diagnostics: {
                nodeVersion: process.version,
                memoryUsage: process.memoryUsage(),
            }
        });
    }
};
