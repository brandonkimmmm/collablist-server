import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { difference } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_NOT_FOUND } from 'src/shared/messages';
import { GetUsersDTO } from './dto';

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

    async findUsers({ limit, page, search }: GetUsersDTO) {
        const whereArgs: Prisma.UserWhereInput = {};

        if (search) {
            whereArgs.OR = [
                {
                    first_name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    last_name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.user.count({
                where: whereArgs
            }),
            this.prismaService.user.findMany({
                where: whereArgs,
                orderBy: {
                    created_at: 'desc'
                },
                ...this.prismaService.generatePaginationQuery(limit, page),
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true
                }
            })
        ]);

        return { count, data };
    }
}
