import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { INVALID_CREDENTIALS } from 'src/shared/messages';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { SerializedUser } from 'src/shared/types/user.type';

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async validateCredentials(email: string, password: string) {
        this.logger.verbose('validateCredentials user', { email });
        const user = await this.prismaService.user.findUnique({
            where: { email }
        });
        if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS);
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword)
            throw new UnauthorizedException(INVALID_CREDENTIALS);
        return omit(user, 'password');
    }

    async createJwtToken(user: SerializedUser) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        });
    }
}
