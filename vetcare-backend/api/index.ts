import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        if (!cachedServer) {
            console.log('--- START BOOTSTRAP ---');

            console.log('Step 1: NestFactory.create...');
            const app = await NestFactory.create(AppModule, {
                logger: ['error', 'warn', 'log'],
            });
            console.log('Step 1: Done');

            console.log('Step 2: useGlobalPipes...');
            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                }),
            );
            console.log('Step 2: Done');

            console.log('Step 3: enableCors...');
            app.enableCors({
                origin: '*',
                credentials: true,
            });
            console.log('Step 3: Done');

            console.log('Step 4: setGlobalPrefix...');
            app.setGlobalPrefix('v1');
            console.log('Step 4: Done');

            console.log('Step 5: app.init...');
            await app.init();
            console.log('Step 5: Done');

            console.log('Step 6: getHttpAdapter...');
            cachedServer = app.getHttpAdapter().getInstance();
            console.log('Step 6: Done');

            console.log('--- BOOTSTRAP SUCCESS ---');
        }

        return cachedServer(req, res);
    } catch (error: any) {
        console.error('--- BOOTSTRAP CRITICAL ERROR ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack,
            tip: 'Check Vercel Build Logs and ensure all environment variables are set.'
        });
    }
};
