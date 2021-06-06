import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto extends PartialType(User) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
