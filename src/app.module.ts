import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'charlie',
      password: '1331',
      database: 'plask',
      entities: [User],
      synchronize: true,
      keepConnectionAlive: true,
      dropSchema: true,
      // logging: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'tempSecret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule {}
