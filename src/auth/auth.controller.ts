import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/shared/decorators/req-user.decorator';
import { SerializedUser } from 'src/shared/types/user.type';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@Controller()
export class AuthController {
    private readonly logger: Logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalGuard)
    async postLogin(@ReqUser() user: SerializedUser) {
        const token = await this.authService.createJwtToken(user);
        return {
            token,
            user
        };
    }
}
