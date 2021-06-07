
## 설명

상품 업로드, 회원 인증 서버

## 설치

```bash
$ npm install
```

## 환경변수
* 아래 예제를 참고하여 .env파일을 최상위 경로에 작성하여 로컬 데이터베이스 정보를 적용한다.

```
// .env_sample

DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
DATABASE_NAME=databasename
```

## 실행

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## 테스트

```bash
$ npm run test
```

## API 정보 (Swagger)
* 서버 실행 후 http://localhost:3000/api/ 접속

## 회고

* 부득이하게 동시에 두개의 코딩테스트를 진행하게 되어 부족한 부분이 많지만 일정에 맞추기 위해 높은 텐션으로 개발을 진행하며 꽤나 즐거운 시간이었습니다. 

* 평소에 관심있던 TDD를 최대한 적용하였습니다. TDD가 항상 정답은 아니지만 빠른 피드백을 통하여 리팩토링을 부담없이 진행할 수 있었습니다.

* 처음으로 Swagger 사용을 해봤습니다. 이전엔 Graphql을 사용해서 restAPI용 협업툴을 접해보지 못했기에 새로운 경험이었습니다.

* 부족한 부분
  * JWT Refresh Token
  * Service/Controller 등의 분업화
  * Interface 활용
  * 코드 중복
  * 이미지 


