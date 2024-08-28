import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, Min } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
  'email',
] as const) {
  @IsNotEmpty()
  @Min(18)
  age: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
