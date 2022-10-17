import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    ValidateIf
} from 'class-validator';

export class PutUsersIdDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(
        (o) => (!o.first_name && !o.last_name && !o.avatar_url) || o.username
    )
    readonly username?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(
        (o) => (!o.username && !o.last_name && !o.avatar_url) || o.first_name
    )
    readonly first_name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(
        (o) => (!o.first_name && !o.username && !o.avatar_url) || o.last_name
    )
    readonly last_name?: string;

    @IsOptional()
    @IsUrl()
    @ValidateIf(
        (o) => (!o.first_name && !o.last_name && !o.username) || o.avatar_url
    )
    readonly avatar_url?: string;
}
