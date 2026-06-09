// ZERO top-level imports — all requires are inside the handler
// so that any missing module is caught and reported in the response.

let cachedServer: any;

export default async (req: any, res: any) => {
    try {
        if (!cachedServer) {
            // Step 1: reflect-metadata
            require('reflect-metadata');

            // Step 2: NestJS core
            const { NestFactory } = require('@nestjs/core');
            const { ValidationPipe } = require('@nestjs/common');

            // Step 3: AppModule (lazy)
            const { AppModule } = require('../src/app.module');

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

            app.enableCors({ origin: '*', credentials: true });
            app.setGlobalPrefix('v1');
            await app.init();

            cachedServer = app.getHttpAdapter().getInstance();
        }

        return cachedServer(req, res);
    } catch (error: any) {
        return res.status(500).json({
            error: 'Bootstrap Failed',
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
        });
    }
};
