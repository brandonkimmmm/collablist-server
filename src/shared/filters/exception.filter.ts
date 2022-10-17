import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { isArray } from 'lodash';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        let httpStatus: number;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
        } else if (exception instanceof Prisma.NotFoundError) {
            httpStatus = HttpStatus.NOT_FOUND;
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const responseBody = {
            statusCode: httpStatus,
            message: isArray((exception as any).response?.message)
                ? (exception as any).response?.message[0]
                : (exception as any).message || 'Internal server error',
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest())
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
