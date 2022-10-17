import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import Default from 'src/shared/decorators/default.decorator';

export class GetListsHistoryDTO {
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

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        return value === 'true';
    })
    readonly is_owned?: boolean;
}
