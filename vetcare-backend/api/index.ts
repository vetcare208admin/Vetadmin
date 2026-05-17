import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let cachedServer: any;

export default async (req: any, res: any) => {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        app.enableCors({
            origin: '*', // For production, replace with frontend URL
            credentials: true,
        });

        app.setGlobalPrefix('v1');
        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }

    return cachedServer(req, res);
};
