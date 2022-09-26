import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class PutListsIdDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.description || o.title)
    readonly title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => !o.title || o.description)
    readonly description?: string;
}
