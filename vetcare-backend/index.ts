import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Module, Controller, Get } from '@nestjs/common';

@Controller('dummy')
class DummyController {
    @Get()
    ping() { return { status: 'dummy-ok', message: 'NestJS is working!' }; }
}

@Module({
    controllers: [DummyController],
})
class DummyModule { }

let cachedServer: any;

export default async (req: any, res: any) => {
    // DIAGNOSTIC FALLBACK
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
            console.log('Bootstrapping NestJS (Dummy) for Vercel...');

            const app = await NestFactory.create(DummyModule, {
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
            tip: 'Check Vercel Build Logs.'
        });
    }
};
