import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf
} from 'class-validator';
import { isBoolean } from 'lodash';

export class PutListsIdDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => (!o.description && !isBoolean(o.is_complete)) || o.title)
    readonly title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => (!o.title && !isBoolean(o.is_complete)) || o.description)
    readonly description?: string;

    @IsOptional()
    @IsBoolean()
    @ValidateIf((o) => (!o.title && !o.description) || isBoolean(o.is_complete))
    readonly is_complete?: boolean;
}
