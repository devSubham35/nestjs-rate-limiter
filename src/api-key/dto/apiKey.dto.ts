import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAPIKeyDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Enter a api key title' })
    title!: string
}