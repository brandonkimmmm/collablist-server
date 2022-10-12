import { IsNotEmpty, IsString } from 'class-validator';

export class PostListsIdItemsDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
}
