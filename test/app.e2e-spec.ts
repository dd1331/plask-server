import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserDto } from '../src/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let agent;

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
  it('/signup', async () => {
    // TODO 중복체크
    const payload: UserDto = {
      userName: 'testusername',
      password: 'testpassword',
      phone: '01000000000',
      email: 'abc@abc.com',
    };
    const { body } = await request(agent)
      .post('/signup')
      .send(payload)
      .expect(201);
  });

  it('/login', async () => {
    const payload: Partial<UserDto> = {
      email: 'abc@abc.com',
      password: 'testpassword',
    };

    const { body } = await request(agent).post('/login').send(payload);
    // .expect(200);
    console.log(body);
  });
});
