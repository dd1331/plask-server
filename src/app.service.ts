import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
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
    private readonly jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async signup(dto: UserDto): Promise<User> {
    if (
      !dto.userName ||
      !dto.password ||
      !dto.phone ||
      !dto.email ||
      !this.validatePassword(dto.password)
    ) {
      throw new HttpException('잘못된 입력입니다', HttpStatus.BAD_REQUEST);
    }
    const createdUser = await this.createUser(dto);

    return createdUser;
  }
  async createUser(dto: UserDto) {
    const refinedDto: UserDto = {
      ...dto,
      phone: this.refinePhoneNumber(dto.phone),
      password: await bcript.hash(dto.password, 12),
    };
    const foundUser = await this.getUser(
      dto.email,
      dto.userName,
      this.refinePhoneNumber(dto.phone),
    );

    if (foundUser) {
      throw new HttpException(
        '이미 존재하는 이메일/유저명입니다',
        HttpStatus.CONFLICT,
      );
    }
    const createdUser = await this.userRepo.create(refinedDto);

    await this.userRepo.save(createdUser);

    return createdUser;
  }
  validatePassword(password) {
    const regex = new RegExp(
      '^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\\-_=+]).{8,}$',
    );
    const result = regex.test(password);
    if (!result)
      throw new HttpException(
        '비밀번호 형식이 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    return result;
  }
  validateEmail(email) {
    const regex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    );
    const result = regex.test(email);
    if (!result)
      throw new HttpException(
        '비밀번호 형식이 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    return result;
  }

  refinePhoneNumber(phone): string {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  async login(user: User): Promise<LoginUser | null> {
    const { email, password } = user;
    const payload = { username: email, sub: password };
    const accessToken = this.jwtService.sign(payload);
    const loginUser: LoginUser = {
      ...user,
      accessToken,
    };
    return loginUser;
  }

  async getUser(
    email?: string,
    userName?: string,
    phone?: string,
  ): Promise<User | null> {
    const where = [];
    if (email) where.push({ email });

    if (userName) where.push({ userName });

    if (phone) where.push({ phone });

    return await this.userRepo.findOne({ where });
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.validatePassword(password);
    this.validateEmail(email);
    const user = await this.getUser(email);
    if (!user)
      throw new HttpException(
        '존재하지 않는 유저입니다',
        HttpStatus.UNAUTHORIZED,
      );
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
