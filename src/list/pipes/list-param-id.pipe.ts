import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListParamIdPipe implements PipeTransform {
    constructor(private readonly prismaService: PrismaService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            await this.prismaService.list.findUniqueOrThrow({
                where: { id: value.id }
            });
        }
        return value;
    }
}
