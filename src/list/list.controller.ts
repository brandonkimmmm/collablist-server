import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { isArray } from 'lodash';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { USER_ROLE } from 'src/shared/constants';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { UserService } from 'src/user/user.service';
import {
    GetListsHistoryDTO,
    ParamListIdDTO,
    ParamListItemIdDTO,
    ParamListMemberIdDTO,
    PostListsDTO,
    PostListsIdItemsDTO,
    PostListsIdMembersDTO,
    PutListsIdDTO,
    PutListsIdItemsIdDTO
} from './dto';
import { ListService } from './list.service';
import { ListIdParamPipe } from './pipes/list-id-param.pipe';
import { ListItemIdParamPipe } from './pipes/list-item-id-param.pipe';
import { ListMemberIdParamPipe } from './pipes/list-member-id-param.pipe';

@Controller('lists')
export class ListController {
    constructor(
        private readonly listService: ListService,
        private readonly userService: UserService
    ) {}

    @Get()
    @UseGuards(JwtGuard)
    async getLists(@ReqUser() reqUser: SerializedUser) {
        return this.listService.findActiveLists(reqUser);
    }

    @Get('history')
    @UseGuards(JwtGuard)
    async getListsHistory(
        @ReqUser() reqUser: SerializedUser,
        @Query() dto: GetListsHistoryDTO
    ) {
        return this.listService.findListsHistory(dto, reqUser);
    }

    @Post()
    @UseGuards(JwtGuard)
    async postLists(
        @ReqUser() reqUser: SerializedUser,
        @Body() dto: PostListsDTO
    ) {
        if (reqUser.role !== USER_ROLE.ADMIN)
            await this.listService.validateUserListNumber(reqUser.id);
        if (isArray(dto.member_ids)) {
            await this.userService.validateUserIds(dto.member_ids, [
                reqUser.id
            ]);
        }
        return this.listService.createList(dto, reqUser);
    }

    @Get(':list_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async getListsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        return this.listService.findList(list_id);
    }

    @Put(':list_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async putListsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO,
        @Body() dto: PutListsIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser, {
            is_owner: true
        });
        await this.listService.validateUpdateList(list_id);
        return this.listService.updateList(list_id, dto);
    }

    @Delete(':list_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async deleteListsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser, {
            is_owner: true
        });
        await this.listService.validateUpdateList(list_id);
        return this.listService.deleteList(list_id);
    }

    @Post(':list_id/items')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async postListsIdItems(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO,
        @Body() dto: PostListsIdItemsDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        await this.listService.validateUpdateList(list_id);
        return this.listService.createListItem(list_id, dto);
    }

    @Put(':list_id/items/:list_item_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListItemIdParamPipe)
    async putListsIdItemsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id, list_item_id }: ParamListItemIdDTO,
        @Body() dto: PutListsIdItemsIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        await this.listService.validateUpdateList(list_id);
        return this.listService.updateListItem(list_item_id, dto);
    }

    @Delete(':list_id/items/:list_item_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListItemIdParamPipe)
    async deleteListsIdItemsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id, list_item_id }: ParamListItemIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        await this.listService.validateUpdateList(list_id);
        const count = await this.listService.countListItems(list_id);
        if (count === 1)
            throw new BadRequestException('List must have at least one item');
        return this.listService.deleteListItem(list_item_id);
    }

    @Post(':list_id/members')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async postListsIdMembers(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO,
        @Body() dto: PostListsIdMembersDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        await this.listService.validateUpdateList(list_id);
        await this.userService.validateUserIds(dto.user_ids, [
            reqUser.id,
            ...(await this.listService.findListMemberIds(list_id))
        ]);
        return this.listService.createListMembers(list_id, dto);
    }

    @Delete(':list_id/members/:list_member_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListMemberIdParamPipe)
    async deleteListsIdMembersId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id, list_member_id }: ParamListMemberIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        await this.listService.validateUpdateList(list_id);
        return this.listService.deleteListMember(list_id, list_member_id);
    }
}
