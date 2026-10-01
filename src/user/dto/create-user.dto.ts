import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateUserDto {

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    @ApiProperty({
        example: 'Example name',
        description: 'Name of the user',
    })
    name!: string

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
