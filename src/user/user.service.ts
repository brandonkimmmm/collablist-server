import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { difference } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_NOT_FOUND } from 'src/shared/messages';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async isExistingUserEmail(email: string) {
        this.logger.debug(`isExistingUserEmail email`, { email });
        const count = await this.prismaService.user.count({ where: { email } });
        return count === 1;
    }

    async createUser(args: Prisma.UserCreateArgs) {
        return this.prismaService.user.create(args);
    }

    async validateUserIds(ids: number[]) {
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            select: {
                id: true
            }
        });
        const notFoundIds = difference(
            ids,
            users.map((u) => u.id)
        );
        if (notFoundIds.length > 0)
            throw new NotFoundException(USERS_NOT_FOUND(notFoundIds));
    }
}
