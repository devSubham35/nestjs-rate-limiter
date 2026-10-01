import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/utils/config';
import { LoginUserDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { APIKeyDocument } from 'src/api-key/schemas/apiKeySchema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async registerService(createUserDto: CreateUserDto) {
    const hashedpassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedpassword,
    });

    const payload = { sub: user._id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: config.JWT_SECRET,
    });

    return {
      access_token,
      message: 'Registered successfully',
    };
  }

  async loginService(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUser(loginUserDto);

    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isMatched) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: config.JWT_SECRET,
    });

    return {
      access_token,
      message: 'Logged in successfully',
    };
  }

  profileService(apiKey: APIKeyDocument) {
    return {
      id: apiKey._id,
      apiId: apiKey.apiId,
      title: apiKey.title,
      plan: apiKey.plan,
      isActive: apiKey.isActive,
      rateLimit: apiKey.rateLimit,
      window: apiKey.window,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    };
  }
}
