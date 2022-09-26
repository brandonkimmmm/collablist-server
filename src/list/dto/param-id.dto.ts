import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsPositive } from 'class-validator';

export class ParamListIdDTO {
    @IsNumberString()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_id: number;
}

export class ParamListItemIdDTO extends ParamListIdDTO {
    @IsNumberString()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_item_id: number;
}

export class ParamListMemberIdDTO extends ParamListIdDTO {
    @IsNumberString()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_member_id: number;
}
