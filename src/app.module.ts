import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config';
import { LoggerModule } from 'nestjs-pino';
import { nanoid } from 'nanoid';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                pinoHttp:
                    config.get('NODE_ENV') !== 'production'
                        ? {
                              level:
                                  config.get('NODE') === 'test'
                                      ? 'silent'
                                      : 'trace',
                              genReqId: () => nanoid(),
                              transport: {
                                  target: 'pino-pretty',
                                  options: {
                                      colorize: true,
                                      levelFirst: true,
                                      translateTime: true
                                  }
                              },
                              customLogLevel: (res, err) => {
                                  if (
                                      res.statusCode >= 400 &&
                                      res.statusCode < 500
                                  ) {
                                      return 'warn';
                                  }
                                  if (res.statusCode >= 500 || err) {
                                      return 'error';
                                  }
                                  return 'info';
                              },
                              serializers: {
                                  req(req) {
                                      return {
                                          id: req.id,
                                          method: req.method,
                                          url: req.url,
                                          host: req.headers.host,
                                          origin: req.headers.origin,
                                          remoteAddress: req.remoteAddress
                                      };
                                  },
                                  res(res) {
                                      return {
                                          statusCode: res.statusCode
                                      };
                                  },
                                  err(err) {
                                      return {
                                          type: err.type,
                                          message: err.message,
                                          stack: err.stack,
                                          code: err.code
                                      };
                                  }
                              },
                              quietReqLogger: true
                          }
                        : {}
            }),
            inject: [ConfigService]
        }),
        PrismaModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
