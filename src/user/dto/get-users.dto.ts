import { Expose, Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength
} from 'class-validator';
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
    @MinLength(3)
    readonly search?: string;
}
