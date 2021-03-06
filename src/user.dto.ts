import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsPhoneNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends PartialType(User) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  // @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
