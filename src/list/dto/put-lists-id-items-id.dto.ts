import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateIf
} from 'class-validator';
import { isUndefined } from 'lodash';

export class PutListsIdItemsIdDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(
        (o) => (isUndefined(o.amount) && isUndefined(o.status)) || o.title
    )
    readonly title?: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @ValidateIf(
        (o) => (isUndefined(o.title) && isUndefined(o.status)) || o.amount
    )
    readonly amount?: number;

    @IsOptional()
    @IsBoolean()
    @ValidateIf(
        (o) =>
            (isUndefined(o.amount) && isUndefined(o.title)) ||
            !isUndefined(o.status)
    )
    readonly status?: boolean;
}
