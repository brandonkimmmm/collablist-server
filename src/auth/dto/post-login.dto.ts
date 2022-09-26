import { Transform } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/shared/constants';

export class PostLoginDTO {
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @Matches(PASSWORD_REGEX)
    readonly password: string;
}
