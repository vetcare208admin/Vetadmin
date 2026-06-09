// Plain JS entry point — avoids tsconfig.json scope conflicts with @vercel/node
let cachedServer;

module.exports = async (req, res) => {
    try {
        if (!cachedServer) {
            require('reflect-metadata');
            const { NestFactory } = require('@nestjs/core');
            const { ValidationPipe } = require('@nestjs/common');
            const { AppModule } = require('../dist/app.module');

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
    } catch (error) {
        return res.status(500).json({
            error: 'Bootstrap Failed',
            message: error.message,
            stack: error.stack ? error.stack.split('\n').slice(0, 8) : null,
        });
    }
};
