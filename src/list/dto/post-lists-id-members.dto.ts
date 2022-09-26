import {
    ArrayMinSize,
    ArrayUnique,
    IsArray,
    IsInt,
    IsPositive
} from 'class-validator';

export class PostListsIdMembersDTO {
    @IsArray()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    @ArrayUnique()
    @ArrayMinSize(1)
    readonly user_ids: number[];
}
