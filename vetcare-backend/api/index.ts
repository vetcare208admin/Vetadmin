import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        // DIAGNOSTIC MODE - visit ?diag=true to check env vars
        if (req.url && req.url.includes('diag=true')) {
            return res.status(200).json({
                status: 'diagnostics-v9',
                node: process.version,
                env_keys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('PASSWORD')),
                has_db_url: !!process.env.DATABASE_URL,
                has_jwt: !!process.env.JWT_SECRET,
                has_frontend_url: !!process.env.FRONTEND_URL,
                cwd: process.cwd(),
            });
        }

        if (!cachedServer) {
            console.log('--- START BOOTSTRAP ---');

            // Correct path: api/index.ts -> ../src/app.module
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

            // Fix CORS: use actual frontend URL so cookies/credentials work
            const frontendUrl = process.env.FRONTEND_URL || 'https://vetadmin-vetcare-frontend.vercel.app';
            app.enableCors({
                origin: frontendUrl,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
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

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 8),
            tip: 'Check Vercel env vars: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL'
        });
    }
};
