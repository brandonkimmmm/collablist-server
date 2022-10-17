import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserIdParamPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            if (isNumber(value.user_id)) {
                await this.prismaService.user.findFirstOrThrow({
                    where: { id: value.user_id }
                });
            }
        }
        return value;
    }
}
