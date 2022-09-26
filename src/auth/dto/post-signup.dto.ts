import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/shared/constants';
import { IsEqualTo } from 'src/shared/decorators/equal-to.decorator';

export class PostSignupDTO {
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @Matches(PASSWORD_REGEX)
    readonly password: string;

    @IsEqualTo('password')
    readonly password_confirmation: string;

    @IsString()
    @IsNotEmpty()
    readonly first_name: string;

    @IsString()
    @IsNotEmpty()
    readonly last_name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly username?: string;
}
