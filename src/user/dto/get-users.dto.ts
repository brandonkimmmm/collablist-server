import { Expose, Transform, Type } from 'class-transformer';
import {
    ArrayMinSize,
    ArrayUnique,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min
} from 'class-validator';
import { isArray } from 'lodash';
import Default from 'src/shared/decorators/default.decorator';

export class GetUsersDTO {
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
    @IsString()
    @IsNotEmpty()
    readonly search?: string;

    @IsOptional()
    @Type(() => Array)
    @Transform(({ value }) =>
        isArray(value)
            ? value.map((v) => parseInt(v, 10))
            : value.split(',').map((v) => parseInt(v, 10))
    )
    @IsArray()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    @ArrayUnique()
    @ArrayMinSize(1)
    readonly exclude_ids?: number[];
}
