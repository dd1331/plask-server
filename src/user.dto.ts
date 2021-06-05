import { PartialType } from '@nestjs/mapped-types';
import { User } from './user.entity';

export class UserDto extends PartialType(User) {
  userName: string;
  password: string;
  phone: string;
  email: string;
}
