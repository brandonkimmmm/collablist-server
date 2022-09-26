import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { UserService } from 'src/user/user.service';
import {
    PostListsDTO,
    PutListsIdDTO,
    ParamListIdDTO,
    PostListsIdItemsDTO,
    PutListsIdItemsIdDTO,
    ParamListItemIdDTO,
    PostListsIdMembersDTO,
    ParamListMemberIdDTO
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

    @Post()
    @UseGuards(JwtGuard)
    async postLists(
        @ReqUser() reqUser: SerializedUser,
        @Body() dto: PostListsDTO
    ) {
        return this.listService.createList(reqUser, dto);
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
        await this.listService.authorizeReqUserList(list_id, reqUser);
        return this.listService.updateList(list_id, dto);
    }

    @Delete(':list_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListIdParamPipe)
    async deleteListsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id }: ParamListIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
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
        await this.userService.validateUserIds(dto.user_ids);
        await this.listService.createListMembers(list_id, dto);
        return this.listService.findListMembers(list_id);
    }

    @Delete(':list_id/members/:list_member_id')
    @UseGuards(JwtGuard)
    @UsePipes(ListMemberIdParamPipe)
    async deleteListsIdMembersId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { list_id, list_member_id }: ParamListMemberIdDTO
    ) {
        await this.listService.authorizeReqUserList(list_id, reqUser);
        return this.listService.deleteListMember(list_id, list_member_id);
    }
}
