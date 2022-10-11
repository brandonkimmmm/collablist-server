import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ParamListIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_id: number;
}

export class ParamListItemIdDTO extends ParamListIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_item_id: number;
}

export class ParamListMemberIdDTO extends ParamListIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly list_member_id: number;
}
