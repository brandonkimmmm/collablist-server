import { IsNotEmpty, IsString } from 'class-validator';

export class PostListsDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
