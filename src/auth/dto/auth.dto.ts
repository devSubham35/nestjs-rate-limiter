import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginUserDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email address of the user',
    })
    email!: string

    @IsNotEmpty()
    @ApiProperty({
        example: 'password***',
        description: 'The password of the user',
    })
    password!: string
}