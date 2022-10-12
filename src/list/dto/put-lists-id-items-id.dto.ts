import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf
} from 'class-validator';
import { isUndefined } from 'lodash';

export class PutListsIdItemsIdDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => isUndefined(o.status) || o.title)
    readonly title?: string;

    @IsOptional()
    @IsBoolean()
    @ValidateIf((o) => isUndefined(o.title) || !isUndefined(o.status))
    readonly status?: boolean;
}
