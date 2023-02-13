import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 정보 조회' })
  @UseGuards(JwtAuthGuard)
  @Get('/info')
  getUserInfo(@GetUser() id) {
    return this.usersService.getUserInfo(id);
  }
}
