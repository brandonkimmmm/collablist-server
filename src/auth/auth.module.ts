import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT.SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT.EXPIRES_IN')
                }
            })
        })
    ],
    providers: [],
    controllers: [],
    exports: []
})
export class AuthModule {}
