import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches, IsNumber, Min, Max, IsIn } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example:"a@b.com"
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'password123',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Password must be alphanumeric' })
    password!: string;

    @ApiProperty({
        example:"mariam ahmed"
    })
    @IsString()
    fullName!: string;

    @ApiProperty({
        example: 23,
    })
    @IsNumber()
    @Min(16)
    @Max(60)
    age!: number;

    @ApiProperty({
        example: '01012345678',
    })
    @Matches(/^01\d{9}$/, { message: 'Mobile number must be 11 digits and start with 01' })
    mobileNumber!: string;

    @ApiProperty({ enum: ['admin', 'normal'] })
    @IsIn(['admin', 'normal'])
    role!: string;
}