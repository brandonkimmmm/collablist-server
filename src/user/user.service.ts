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

    async validateUserIds(ids: number[], invalidIds: number[] = []) {
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: ids,
                    notIn: invalidIds
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

    async findUsers({ limit, page, search, exclude_ids }: GetUsersDTO) {
        const whereArgs: Prisma.UserWhereInput = {
            role: 'USER'
        };

        if (search) {
            whereArgs.OR = [
                {
                    first_name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    last_name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    username: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        if (exclude_ids && exclude_ids.length > 0) {
            whereArgs.id = {
                notIn: exclude_ids
            };
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
                    last_name: true,
                    username: true,
                    created_at: true,
                    updated_at: true
                }
            })
        ]);

        return { count, data };
    }
}
