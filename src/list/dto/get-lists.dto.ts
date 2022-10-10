import { Expose, Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import Default from 'src/shared/decorators/default.decorator';

export class GetListsDTO {
    @Expose()
    @Default(50)
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    readonly limit: number;

    @Expose()
    @Default(1)
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page: number;
}
