import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { GithubCodeDto } from './users.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  
@ApiOperation({ summary: 'user 회원가입 및 로그인' })
  @Get('/signin')
  public async getGithubInfo(@Query() githubCodeDto: GithubCodeDto) : Promise<{ accessToken: string }> {
    const {code} = githubCodeDto
    await this.userService.getGithubInfo;
    const user = await this.userService.getGithubInfo(githubCodeDto);
    
    return user;
  }
}