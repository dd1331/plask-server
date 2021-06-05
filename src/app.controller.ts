import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signup')
  signup(@Body() dto: UserDto) {
    return this.appService.signup(dto);
  }
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Body() dto: UserDto) {
    return this.appService.login(dto);
  }
}
