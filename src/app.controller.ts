import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { ItemDto } from './item.dto';
import { SearchOptions } from './search-options';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './Login.dto';
@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signup')
  signup(@Body() dto: UserDto) {
    return this.appService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req) {
    return this.appService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  upload(@Body() dto: ItemDto) {
    return this.appService.upload(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }

  @Post('/items')
  @HttpCode(200)
  getItems(@Body() searchOptions?: SearchOptions) {
    return this.appService.getItems(searchOptions);
  }
}
