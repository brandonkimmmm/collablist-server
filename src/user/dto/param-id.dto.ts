import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ParamUserIdDTO {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly user_id: number;
}
