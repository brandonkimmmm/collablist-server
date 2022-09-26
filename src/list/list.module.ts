import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
    imports: [UserModule],
    controllers: [ListController],
    providers: [ListService],
    exports: [ListService]
})
export class ListModule {}
