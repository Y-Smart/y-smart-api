import { BaseException } from '@shared/exceptions/base.exception';
import { Response } from 'express';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // For debugging purposes
        console.log(exception);

        if (exception instanceof BaseException) {
            return response.status(exception.statusCode).json({
                statusCode: exception.statusCode,
                message: exception.message,
            });
        } else if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.message,
            });
        } else {
            return response.status(500).json({
                statusCode: 500,
                message: 'Erreur interne du serveur',
            });
        }
    }
}
