import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_ROLE } from 'src/shared/constants';
import { NOT_AUTHORIZED_FOR_LIST } from 'src/shared/messages';
import { SerializedUser } from 'src/shared/types/user.type';
import { PostListsDTO, PutListsIdDTO } from './dto';

@Injectable()
export class ListService {
    private readonly logger: Logger = new Logger(ListService.name);

    constructor(private readonly prismaService: PrismaService) {}

    async authorizeReqUserList(listId: number, reqUser: SerializedUser) {
        const list = await this.prismaService.list.findUniqueOrThrow({
            where: { id: listId },
            select: {
                user_id: true,
                memberships: {
                    select: {
                        user_id: true
                    }
                }
            }
        });
        if (
            reqUser.role !== USER_ROLE.ADMIN &&
            list.user_id !== reqUser.id &&
            !list.memberships.find((m) => m.user_id === reqUser.id)
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

    async findList(listId: number) {
        return this.prismaService.list.findUniqueOrThrow({
            where: {
                id: listId
            },
            select: {
                id: true,
                title: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                memberships: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        amount: true,
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
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                memberships: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                },
                items: {
                    select: {
                        id: true,
                        title: true,
                        amount: true,
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
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });
    }
}
