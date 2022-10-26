import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isBoolean } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_ROLE } from 'src/shared/constants';
import { NOT_AUTHORIZED_FOR_LIST } from 'src/shared/messages';
import { SerializedUser } from 'src/shared/types/user.type';
import {
    GetListsHistoryDTO,
    PostListsDTO,
    PostListsIdItemsDTO,
    PostListsIdMembersDTO,
    PutListsIdDTO,
    PutListsIdItemsIdDTO
} from './dto';

@Injectable()
export class ListService {
    private readonly logger: Logger = new Logger(ListService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async authorizeReqUserList(
        listId: number,
        reqUser: SerializedUser,
        opts: { is_owner?: boolean } = { is_owner: false }
    ) {
        const list = await this.prismaService.list.findUniqueOrThrow({
            where: { id: listId },
            select: {
                user_id: true,
                members: {
                    select: {
                        user_id: true
                    }
                }
            }
        });
        if (reqUser.role === USER_ROLE.ADMIN) return;
        if (
            opts.is_owner
                ? list.user_id !== reqUser.id
                : list.user_id !== reqUser.id &&
                  !list.members.find((m) => m.user_id === reqUser.id)
        ) {
            throw new UnauthorizedException(NOT_AUTHORIZED_FOR_LIST);
        }
    }

    async createList(
        { title, description, items, member_ids }: PostListsDTO,
        reqUser: SerializedUser
    ) {
        return this.prismaService.$transaction(async (prisma) => {
            const list = await prisma.list.create({
                data: {
                    title,
                    description,
                    user: {
                        connect: {
                            id: reqUser.id
                        }
                    }
                }
            });

            for (const item of items) {
                await prisma.listItem.create({
                    data: {
                        list_id: list.id,
                        ...item
                    }
                });
            }

            for (const member of member_ids) {
                await prisma.membership.create({
                    data: {
                        list_id: list.id,
                        user_id: member
                    }
                });
            }

            return this.prismaService.list.findUnique({
                where: { id: list.id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    created_at: true,
                    is_complete: true,
                    updated_at: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            first_name: true,
                            last_name: true,
                            username: true,
                            avatar_url: true,
                            created_at: true,
                            updated_at: true
                        }
                    },
                    members: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    first_name: true,
                                    avatar_url: true,
                                    last_name: true,
                                    created_at: true,
                                    updated_at: true,
                                    username: true
                                }
                            }
                        }
                    },
                    items: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            created_at: true,
                            updated_at: true
                        }
                    }
                }
            });
        });
    }

    async findActiveLists(reqUser: SerializedUser) {
        const whereArgs: Prisma.ListWhereInput = {
            is_complete: false
        };

        if (reqUser.role !== USER_ROLE.ADMIN) {
            whereArgs.OR = [
                { user_id: reqUser.id },
                {
                    members: {
                        some: {
                            user_id: reqUser.id
                        }
                    }
                }
            ];
        }

        return this.prismaService.list.findMany({
            where: whereArgs,
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                created_at: true,
                is_complete: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        username: true,
                        avatar_url: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                avatar_url: true,
                                last_name: true,
                                created_at: true,
                                updated_at: true,
                                username: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        created_at: true,
                        updated_at: true
                    }
                }
            }
        });
    }

    async findListsHistory(
        { is_owned, limit, page }: GetListsHistoryDTO,
        reqUser: SerializedUser
    ) {
        const whereArgs: Prisma.ListWhereInput = {
            is_complete: true
        };

        if (reqUser.role !== USER_ROLE.ADMIN) {
            if (isBoolean(is_owned)) {
                if (is_owned) {
                    whereArgs.user_id = reqUser.id;
                } else {
                    whereArgs.members = {
                        some: {
                            user_id: reqUser.id
                        }
                    };
                }
            } else {
                whereArgs.OR = [
                    { user_id: reqUser.id },
                    {
                        members: {
                            some: {
                                user_id: reqUser.id
                            }
                        }
                    }
                ];
            }
        }

        const [count, data] = await this.prismaService.$transaction([
            this.prismaService.list.count({
                where: whereArgs
            }),
            this.prismaService.list.findMany({
                where: whereArgs,
                orderBy: {
                    created_at: 'desc'
                },
                ...this.prismaService.generatePaginationQuery(limit, page),
                select: {
                    id: true,
                    title: true,
                    description: true,
                    created_at: true,
                    is_complete: true,
                    updated_at: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            first_name: true,
                            avatar_url: true,
                            last_name: true,
                            username: true,
                            created_at: true,
                            updated_at: true
                        }
                    },
                    members: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    first_name: true,
                                    last_name: true,
                                    avatar_url: true,
                                    created_at: true,
                                    updated_at: true,
                                    username: true
                                }
                            }
                        }
                    },
                    items: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            created_at: true,
                            updated_at: true
                        }
                    }
                }
            })
        ]);

        return { count, data };
    }

    async findList(listId: number) {
        return this.prismaService.list.findUniqueOrThrow({
            where: {
                id: listId
            },
            select: {
                id: true,
                title: true,
                description: true,
                created_at: true,
                is_complete: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar_url: true,
                        username: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                avatar_url: true,
                                last_name: true,
                                created_at: true,
                                updated_at: true,
                                username: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        created_at: true,
                        updated_at: true
                    }
                }
            }
        });
    }

    async updateList(listId: number, dto: PutListsIdDTO) {
        return this.prismaService.list.update({
            where: {
                id: listId
            },
            data: dto,
            select: {
                id: true,
                title: true,
                description: true,
                created_at: true,
                is_complete: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        avatar_url: true,
                        last_name: true,
                        username: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                last_name: true,
                                avatar_url: true,
                                created_at: true,
                                updated_at: true,
                                username: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        created_at: true,
                        updated_at: true
                    }
                }
            }
        });
    }

    async deleteList(listId: number) {
        return this.prismaService.list.delete({
            where: {
                id: listId
            },
            select: {
                id: true,
                title: true,
                description: true,
                is_complete: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar_url: true,
                        username: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                last_name: true,
                                avatar_url: true,
                                created_at: true,
                                updated_at: true,
                                username: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        created_at: true,
                        updated_at: true
                    }
                }
            }
        });
    }

    async createListItem(listId: number, { title }: PostListsIdItemsDTO) {
        return this.prismaService.listItem.create({
            data: {
                list: {
                    connect: {
                        id: listId
                    }
                },
                title
            },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    async updateListItem(
        listItemId: number,
        { title, status }: PutListsIdItemsIdDTO
    ) {
        return this.prismaService.listItem.update({
            where: {
                id: listItemId
            },
            data: {
                title,
                status
            },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    async countListItems(listId: number) {
        return this.prismaService.listItem.count({
            where: {
                list_id: listId
            }
        });
    }

    async deleteListItem(listItemId: number) {
        return this.prismaService.listItem.delete({
            where: {
                id: listItemId
            },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    async createListMembers(listId: number, dto: PostListsIdMembersDTO) {
        return this.prismaService.$transaction(async (prisma) => {
            for (const userId of dto.user_ids) {
                await prisma.membership.create({
                    data: {
                        list_id: listId,
                        user_id: userId
                    }
                });
            }

            return prisma.membership.findMany({
                where: {
                    list_id: listId,
                    user: {
                        id: {
                            in: dto.user_ids
                        }
                    }
                },
                select: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            avatar_url: true,
                            first_name: true,
                            last_name: true,
                            created_at: true,
                            updated_at: true,
                            username: true
                        }
                    }
                }
            });
        });
    }

    async findListMembers(listId: number) {
        return this.prismaService.membership.findMany({
            where: {
                list_id: listId
            },
            select: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        created_at: true,
                        avatar_url: true,
                        updated_at: true,
                        username: true
                    }
                }
            }
        });
    }

    async deleteListMember(listId: number, memberId: number) {
        return this.prismaService.membership.delete({
            where: {
                user_id_list_id: {
                    list_id: listId,
                    user_id: memberId
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar_url: true,
                        created_at: true,
                        updated_at: true,
                        username: true
                    }
                }
            }
        });
    }

    async findListMemberIds(listId: number) {
        const data = await this.prismaService.membership.findMany({
            where: {
                list_id: listId
            },
            select: {
                user_id: true
            }
        });
        return data.map((d) => d.user_id);
    }

    async validateUpdateList(listId: number) {
        const list = await this.prismaService.list.findFirstOrThrow({
            where: {
                id: listId
            },
            select: {
                is_complete: true
            }
        });
        if (list.is_complete)
            throw new BadRequestException('Cannot update complete list');
    }

    async validateUserListNumber(userId: number) {
        const count = await this.prismaService.list.count({
            where: {
                user_id: userId,
                is_complete: false
            }
        });

        if (count >= 10)
            throw new BadRequestException(
                'Cannot have more than 10 active lists'
            );
    }
}
