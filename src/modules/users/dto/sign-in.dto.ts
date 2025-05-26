import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        example: "a@b.com"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
    })
    @IsString()
    @MinLength(8)
    password: string;
}
