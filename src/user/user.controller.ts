import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { GetUsersDTO } from './dto';
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
}
