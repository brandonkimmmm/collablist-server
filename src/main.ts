import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get<ConfigService>(ConfigService);

    app.setGlobalPrefix(config.get<string>('GLOBAL_PREFIX') as string);
    app.useLogger(app.get<Logger>(Logger));
    app.enableCors();
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            enableDebugMessages: config.get('NODE_ENV') !== 'production'
        })
    );
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    const prismaService: PrismaService = app.get(PrismaService);
    prismaService.enableShutdownHooks(app);
    await app.listen(config.get<number>('PORT') as number);
}
bootstrap();
