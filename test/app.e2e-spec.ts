import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, Body } from '@nestjs/common';
import * as request from 'supertest';
import each from 'jest-each';
import { AppModule } from '../src/app.module';
import { UserDto } from '../src/user.dto';
import { ItemDto } from 'src/item.dto';
import { Item } from 'src/item.entity';
import { SearchOptions } from 'src/search-options';
import { User } from 'src/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent;
  let uploadedItem: Item;
  let token;
  const createdUsers: User[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    agent = app.getHttpServer();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  // 회원가입 진행 시 받는 정보는 이메일, 비밀번호, 이름, 전화번호 입니다.

  // 회원가입 시 비밀번호는 세가지 종류 이상의 문자구성으로 8자리 이상의 길이로 구성된 문자열으로
  // 검증하며, 검증되지 않을 시 에러를 리턴합니다. (비밀번호 암호화 방식은 자유롭게 진행합니다.)

  // 전화번호 같은 경우 01012345678 이라는 입력값이 올 때 010-1234-5678로 변경 저장해야 합니다.

  // 동일한 이메일이 존재할 시 비밀번호와 동일하게 에러를 리턴합니다.
  describe('singup', () => {
    const signupParams: UserDto[] = [
      {
        userName: '',
        password: 'testpassword',
        phone: '01000000000',
        email: 'abc@abc.com',
      },
      {
        userName: 'testusername',
        password: '',
        phone: '01000000001',
        email: 'abc@abc.com2',
      },
      {
        userName: 'testusername2',
        password: 'testpassword',
        phone: '',
        email: 'abc@abc.com3',
      },
      {
        userName: 'testusername3',
        password: 'testpassword',
        phone: '01000000002',
        email: '',
      },
      {
        userName: 'testusername4',
        password: 'testpassword',
        phone: '01000000002',
        email: '',
      },
      {
        userName: 'testusername5',
        password: 'Ab9113@@',
        phone: '01000000002',
        email: 'abc@abc.com',
      },
      {
        userName: 'testusername5',
        password: 'duplicated13@@',
        phone: '01000000003',
        email: 'abc@abc.com6',
      },
      {
        userName: 'testusername6',
        password: 'duplicated13@@',
        phone: '01000000002',
        email: 'abc@abc.com6',
      },
      {
        userName: 'testusername6',
        password: 'duplicated13@@',
        phone: '01000000003',
        email: 'abc@abc.com',
      },
    ];
    each(signupParams).it(
      '/회원가입 진행 시 받는 정보는 이메일, 비밀번호, 이름, 전화번호 입니다.',
      async (payload) => {
        // TODO 중복체크
        const { body, status } = await request(agent)
          .post('/signup')
          .send(payload);
        if (
          !payload.userName ||
          !payload.password ||
          !payload.phone ||
          !payload.email ||
          payload.password.includes('duplicated')
        ) {
          expect(status).toBe(HttpStatus.BAD_REQUEST);
        } else {
          expect(status).toBe(HttpStatus.CREATED);
          createdUsers.push(body);
        }
      },
    );
  });

  // 로그인 진행 시 받는 정보는 이메일 및 비밀번호 입니다.
  // 이메일과 비밀번호를 모두 입력 후 로그인 성공 시 JSON Web Token(JWT),
  // Access Token 및 Refresh Token를 리턴합니다.
  // 회원가입과 동일하게 비밀번호는 세가지 종류 이상의 문자구성으로 8자리 이상의 길이로 구성된 문자열으로 검증하며, 검증되지 않을 시 에러를 리턴합니다.
  describe('login', () => {
    it('/login', async () => {
      const payload: Partial<UserDto> = {
        email: 'abc@abc.com',
        password: 'Ab9113@@',
      };

      const { body } = await request(agent).post('/login').send(payload);
      token = body.accessToken;
      // .expect(200);
    });
  });

  // 상품 등록 및 삭제 기능을 구현해야 합니다. 상품 등록 시 받는 정보는 이미지, 무료 배송 여부, 상품 이름, 할인율, 할인 전 가격, 할인 후 가격, 평점 입니다.

  // 상품 삭제 시 상품 등록 시 등록된 ID를 기반으로 상품을 삭제합니다.

  // 필터 기능이 있는 상품 리스트를 구현해야 합니다. 필터는 낮은 가격, 높은 가격, 평점, 최신순으로 나뉘어 있습니다. (필터 및 상품 리스트에 대한 엔드포인트를 각각 나눠도 상관없습니다.)

  // 낮은 가격을 적용하였을 때를 가정하면, 가장 낮은 가격을 가진 상품이 첫번째 표시가 되어야 합니다.

  // 기본 환경은 10개까지 로드되지만, 사용자 요청에 따라 20개~40개까지 로드할 수 있습니다.
  describe('item', () => {
    const itemParams = [
      { listingPrice: 300, rating: 3 },
      { listingPrice: 5000, rating: 4.5 },
      { listingPrice: 2000, rating: 2 },
      { listingPrice: 9000, rating: 1.3 },
      { listingPrice: 500, rating: 4.9 },
      { listingPrice: 3455, rating: 4 },
      { listingPrice: 3455, rating: 2 },
      { listingPrice: 34455, rating: 1.1 },
      { listingPrice: 83455, rating: 4.2 },
      { listingPrice: 53455, rating: 0 },
      { listingPrice: 33455, rating: 2.3 },
      { listingPrice: 34655, rating: 1 },
    ];
    each(itemParams).it('/upload item', async (param) => {
      const payload: ItemDto = {
        itemName: 'testItemName',
        image: 'testpath',
        shipmentCharge: true,
        discountRate: 10,
        originalPrice: 5000,
        listingPrice: param.listingPrice,
        rating: param.rating,
      };

      const { body } = await request(agent)
        .post('/upload')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(201);
      expect(body).toEqual(expect.objectContaining(payload));
      uploadedItem = body;
    });

    it('/delete item', async () => {
      const { body } = await request(agent)
        .delete(`/delete/${uploadedItem.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);
      expect(body.id).toEqual(uploadedItem.id);
      expect(body.deletedAt).toBeTruthy();
    });

    const searchOptions = [
      { filter: 'highest', take: 3 },
      { filter: 'lowest', take: 1 },
      { filter: 'rating' },
      { filter: '', take: 2 },
    ];
    each(searchOptions).it('/items', async (options) => {
      const { filter, take } = options;
      const searchOptions: SearchOptions = {
        filter,
        take,
      };
      const { body } = await request(agent).post('/items').send(searchOptions);
      // .expect(HttpStatus.OK);
      expect(body).toHaveLength(take ? take : 10);
      if (filter === 'highest') {
        const items = itemParams
          .slice(0, itemParams.length - 1)
          .sort(function (a, b) {
            return b.listingPrice - a.listingPrice;
          });
        const result = body.every((item, index) => {
          return item.listingPrice === items[index].listingPrice;
        });
        expect(result).toBeTruthy();
      }
      if (filter === 'lowest') {
        const items = itemParams
          .slice(0, itemParams.length - 1)
          .sort(function (a, b) {
            return a.listingPrice - b.listingPrice;
          });
        const result = body.every((item, index) => {
          return item.listingPrice === items[index].listingPrice;
        });
        expect(result).toBeTruthy();
      }
      if (filter === 'rating') {
        const items = itemParams
          .slice(0, itemParams.length - 1)
          .sort(function (a, b) {
            return b.rating - a.rating;
          });
        const result = body.every((item, index) => {
          return item.rating === items[index].rating;
        });
        expect(result).toBeTruthy();
      }
    });
  });
});
