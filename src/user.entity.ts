import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
