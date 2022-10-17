import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    ArrayUnique,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested
} from 'class-validator';
import { PostListsIdItemsDTO } from './post-lists-id-items.dto';

export class PostListsDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PostListsIdItemsDTO)
    readonly items: PostListsIdItemsDTO[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    @ArrayUnique()
    @ArrayMinSize(1)
    readonly member_ids?: number[];
}
