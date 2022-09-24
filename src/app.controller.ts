import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('health')
    getHello() {
        return {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version
        };
    }
}
