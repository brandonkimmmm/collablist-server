import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_ROLE } from 'src/shared/constants';
import { NOT_AUTHORIZED_FOR_LIST } from 'src/shared/messages';
import { SerializedUser } from 'src/shared/types/user.type';
import {
    GetListsDTO,
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

    async authorizeReqUserList(listId: number, reqUser: SerializedUser) {
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
        if (
            reqUser.role !== USER_ROLE.ADMIN &&
            list.user_id !== reqUser.id &&
            !list.members.find((m) => m.user_id === reqUser.id)
        ) {
            throw new UnauthorizedException(NOT_AUTHORIZED_FOR_LIST);
        }
    }

    async createList(
        reqUser: SerializedUser,
        { title, description }: PostListsDTO
    ) {
        return this.prismaService.list.create({
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
    }

    async findLists({
        limit,
        page,
        user_id
    }: GetListsDTO & { user_id?: number }) {
        const whereArgs: Prisma.ListWhereInput = {};

        if (user_id) {
            whereArgs.OR = [
                { user_id },
                {
                    members: {
                        some: {
                            user_id
                        }
                    }
                }
            ];
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
                    updated_at: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            first_name: true,
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

        return {
            count,
            data
        };
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
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
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
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
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
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
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
        await this.prismaService.membership.createMany({
            skipDuplicates: true,
            data: dto.user_ids.map((userId) => ({
                list_id: listId,
                user_id: userId
            }))
        });
        return this.prismaService.membership.findMany({
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
                        first_name: true,
                        last_name: true,
                        created_at: true,
                        updated_at: true,
                        username: true
                    }
                }
            }
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
                        created_at: true,
                        updated_at: true,
                        username: true
                    }
                }
            }
        });
    }
}
