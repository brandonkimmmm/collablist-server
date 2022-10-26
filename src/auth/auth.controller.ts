import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Post,
    UseGuards
} from '@nestjs/common';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import {
    INVALID_PASSWORD_CONFIRMATION,
    USER_EXISTS
} from 'src/shared/messages';
import { SerializedUser } from 'src/shared/types/user.type';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PostSignupDTO } from './dto';
import { JwtGuard } from './jwt/jwt.guard';
import { LocalGuard } from './local/local.guard';

@Controller()
export class AuthController {
    private readonly logger: Logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('login')
    @UseGuards(LocalGuard)
    async postLogin(@ReqUser() user: SerializedUser) {
        const token = await this.authService.createJwtToken(user);
        return {
            token,
            user
        };
    }

    @Get('check-token')
    @UseGuards(JwtGuard)
    async getCheckToken(@ReqUser() user: SerializedUser) {
        return user;
    }

    @Post('signup')
    async postSignup(
        @Body()
        {
            email,
            password,
            password_confirmation,
            first_name,
            last_name,
            username
        }: PostSignupDTO
    ) {
        throw new BadRequestException('Cannot signup at this time');
        if (password !== password_confirmation)
            throw new BadRequestException(INVALID_PASSWORD_CONFIRMATION);
        const isTakenEmail = await this.userService.isExistingUserEmail(email);
        if (isTakenEmail) throw new BadRequestException(USER_EXISTS(email));
        await this.userService.createUser({
            data: {
                email,
                password,
                first_name,
                last_name,
                username: username || email.split('@')[0]
            }
        });
        return { message: 'Success' };
    }
}
