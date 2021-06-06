import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsPhoneNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { User } from './user.entity';

export class UserDto extends PartialType(User) {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
