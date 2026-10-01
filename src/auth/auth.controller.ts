import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerService(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginService(loginUserDto);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Req() req) {

    const userDetails = await this.userService.getProfileDetails(req.user.sub)

    return {
      "data": userDetails,
      "message": "Profile data fetched successfully"
    }
  }
}
