import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    UnauthorizedException,
    UseGuards,
    UsePipes
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { USER_ROLE } from 'src/shared/constants';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetUsersDTO, ParamUserIdDTO, PutUsersIdDTO } from './dto';
import { UserIdParamPipe } from './pipes/user-id-param.pipe';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtGuard)
    async getUsers(
        @ReqUser() reqUser: SerializedUser,
        @Query() dto: GetUsersDTO
    ) {
        if (dto.exclude_ids) {
            await this.userService.validateUserIds(dto.exclude_ids);
        }
        return this.userService.findUsers(dto);
    }

    @Put(':user_id')
    @UseGuards(JwtGuard)
    @UsePipes(UserIdParamPipe)
    async putUser(
        @ReqUser() reqUser: SerializedUser,
        @Param() { user_id }: ParamUserIdDTO,
        @Body() dto: PutUsersIdDTO
    ) {
        if (reqUser.role !== USER_ROLE.ADMIN && user_id !== reqUser.id) {
            throw new UnauthorizedException('Cannot update another user');
        }
        return this.userService.updateUser(user_id, dto);
    }
}
