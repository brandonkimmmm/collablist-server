import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsPositive } from 'class-validator';

export class GetIdDTO {
    @IsNumberString()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    readonly id: number;
}
