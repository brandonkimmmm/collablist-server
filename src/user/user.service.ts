import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async isExistingUserEmail(email: string) {
        this.logger.debug(`isExistingUserEmail email`, { email });
        const count = await this.prismaService.user.count({ where: { email } });
        return count === 1;
    }
}
