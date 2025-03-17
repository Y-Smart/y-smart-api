import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@config/filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            exceptionFactory(errors) {
                return new HttpException(
                    errors[0].constraints?.isDefined ||
                        errors[0].constraints?.minLength ||
                        errors[0].constraints?.isNotEmpty ||
                        'Données invalides',
                    HttpStatus.BAD_REQUEST,
                );
            },
        }),
    );
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
