import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        // DIAGNOSTIC MODE
        if (req.url && req.url.includes('diag=true')) {
            return res.status(200).json({
                status: 'diagnostics-v8',
                node: process.version,
                env_keys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('PASSWORD')),
                has_db_url: !!process.env.DATABASE_URL,
                cwd: process.cwd(),
                dir_contents: await (async () => { try { return require('fs').readdirSync('.'); } catch (e) { return e.message; } })()
            });
        }

        if (!cachedServer) {
            console.log('--- START BOOTSTRAP (v8-DIAG) ---');

            // Resolve relative path based on location
            let AppModule;
            try {
                // Try backend subfolder first (if root)
                const mod = await import('../vetcare-backend/src/app.module');
                AppModule = mod.AppModule;
                console.log('Loaded AppModule from ../vetcare-backend/src/app.module');
            } catch (e) {
                // Try local src folder (if in subfolder)
                const mod = await import('../src/app.module');
                AppModule = mod.AppModule;
                console.log('Loaded AppModule from ../src/app.module');
            }

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

        return res.status(500).json({
            error: 'Backend Initialization Failed',
            version: 'v8-DIAG',
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            tip: 'Try ?diag=true to see environment details.'
        });
    }
};
