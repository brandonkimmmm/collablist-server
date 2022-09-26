import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class PostListsIdItemsDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsInt()
    @IsPositive()
    readonly amount: number;
}
