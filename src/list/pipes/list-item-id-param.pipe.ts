import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListItemIdParamPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            if (isNumber(value.list_id) && isNumber(value.list_item_id)) {
                await this.prismaService.listItem.findFirstOrThrow({
                    where: { id: value.list_item_id, list_id: value.list_id }
                });
            }
        }
        return value;
    }
}
