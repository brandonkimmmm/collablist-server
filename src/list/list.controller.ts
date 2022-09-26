import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { GetIdDTO } from 'src/shared/dto';
import { SerializedUser } from 'src/shared/types/user.type';
import { PostListsDTO, PutListsIdDTO } from './dto';
import { ListService } from './list.service';
import { ListParamIdPipe } from './pipes/list-param-id.pipe';

@Controller('lists')
export class ListController {
    constructor(private readonly listService: ListService) {}

    @Post()
    @UseGuards(JwtGuard)
    async postLists(
        @ReqUser() reqUser: SerializedUser,
        @Body() dto: PostListsDTO
    ) {
        return this.listService.createList(reqUser, dto);
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    @UsePipes(ListParamIdPipe)
    async getListsId(
        @ReqUser() reqUser: SerializedUser,
        @Param() { id }: GetIdDTO
    ) {
        await this.listService.authorizeReqUserList(id, reqUser);
        return this.listService.findList(id);
    }

    @Put(':id')
    @UseGuards(JwtGuard)
    @UsePipes(ListParamIdPipe)
    async putListsID(
        @ReqUser() reqUser: SerializedUser,
        @Param() { id }: GetIdDTO,
        @Body() dto: PutListsIdDTO
    ) {
        await this.listService.authorizeReqUserList(id, reqUser);
        return this.listService.updateList(id, dto);
    }
}
