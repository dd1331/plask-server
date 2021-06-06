import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { UserDto } from './user.dto';
import * as bcript from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { ItemDto } from './item.dto';
import { Item } from './item.entity';
import { SearchOptions } from './search-options';
type LoginUser = Partial<User> & { accessToken: string };
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    private jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async signup(dto: UserDto): Promise<User> {
    const password = await bcript.hash(dto.password, 12);
    const createdUser = await this.userRepo.create({ ...dto, password });
    await this.userRepo.save(createdUser);
    return createdUser;
  }

  async login(dto: UserDto): Promise<LoginUser | null> {
    const { email, password } = dto;
    const foundUser: User = await this.getUser(email);
    const isEqual = await bcript.compare(password, foundUser.password);
    const payload = { username: email, sub: password };
    const loginUser: LoginUser = {
      ...foundUser,
      accessToken: this.jwtService.sign(payload),
    };
    return isEqual ? loginUser : null;
  }

  async getUser(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.getUser(email);
    if (!user)
      throw new HttpException('존재하지 않는 유저입니다', HttpStatus.NOT_FOUND);
    const isEqual = await bcript.compare(password, user.password);
    if (user && isEqual) {
      return user;
    }
    return null;
  }

  async upload(dto: ItemDto): Promise<Item | null> {
    const createItem = await this.itemRepo.create(dto);

    await this.itemRepo.save(createItem);

    return createItem;
  }

  async delete(id: string): Promise<Item | null> {
    await this.itemRepo.softDelete(id);

    const deletedItem = await this.itemRepo.findOne(id, { withDeleted: true });
    return deletedItem;
  }

  async getItems(searchOptions: SearchOptions): Promise<Item[]> {
    const { filter, take } = searchOptions;
    const where: FindManyOptions<Item> = {
      order: { createdAt: 'DESC' },
      take: take ? take : 10,
    };
    if (filter === 'highest') {
      where.order = { listingPrice: 'DESC' };
    }
    if (filter === 'lowest') {
      where.order = { listingPrice: 'ASC' };
    }
    if (filter === 'rating') {
      where.order = { rating: 'DESC' };
    }
    return await this.itemRepo.find(where);
  }
}
