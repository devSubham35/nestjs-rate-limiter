import { Model } from 'mongoose';
import { User } from './schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './../auth/dto/auth.dto';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  /// Create user
  async createUser(createUserDto: CreateUserDto) {

    try {
      return await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      })
    } catch (error) {

      const err = error as { code: number }

      if (err.code === 11000) {
        throw new ConflictException("Duplicate email")
      }

      throw error
    }
  }

  /// Find user
  async findUser(loginUserDto: LoginUserDto) {
    try {

      const existingUser = await this.userModel.findOne({
        email: loginUserDto.email
      })

      if (!existingUser) {
        throw new BadRequestException("User not found")
      }

      return existingUser

    } catch (error) {

      throw error
    }
  }

  /// get user profile details
  async getProfileDetails(userId: string) {

    const user = await this.userModel.findOne({ 
      _id: userId 
    }).select(["-password", "-createdAt", "-updatedAt"])

    if(!user){
      throw new BadRequestException("User not found")
    }

    return user
  }
}
