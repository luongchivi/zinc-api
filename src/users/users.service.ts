import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    return hashPassword;
  };

  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  };

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: this.getHashPassword(createUserDto.password),
    });
    return newUser;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .lean();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid user ID format');
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          { ...updateUserDto },
          { new: true }, // Tùy chọn này sẽ trả về document sau khi được cập nhật
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userModel.deleteOne({ _id: id });

      return 'Delete user successfully';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
