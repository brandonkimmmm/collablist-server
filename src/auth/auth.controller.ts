import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    private readonly logger: Logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    async postLogin();
}
