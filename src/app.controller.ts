import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { ItemDto } from './item.dto';
import { SearchOptions } from './search-options';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { LocalAuthGuard } from './passport/local-auth.guard';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signup')
  signup(@Body() dto: UserDto) {
    return this.appService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() dto: UserDto) {
    return this.appService.login(dto);
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
  getItems(@Body() searchOptions?: SearchOptions) {
    return this.appService.getItems(searchOptions);
  }
}
