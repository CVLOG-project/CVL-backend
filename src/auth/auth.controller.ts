import { 
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { GithubCodeDto } from 'src/users/users.dto';
import { Response } from 'express';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { UserEntity } from 'src/entities/users.entity';
import { GetUser } from './auth.decorator';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @ApiOperation({ summary: 'user 회원가입 및 로그인' })
  @Get('login')
  public async getGithubInfo(@Query() githubCodeDto: GithubCodeDto, @Res({ passthrough: true }) res: Response) : Promise<{ accessToken: string }> {
    await this.authService.getGithubInfo;
    const accessToken = await this.authService.getGithubInfo(githubCodeDto, res);
    
    return accessToken;
  }

  @ApiOperation({ summary: 'accessToken 재발급' })
  @Post('/refresh')
  @Header('Cache-Control', 'none')
  @UseGuards(JwtRefreshTokenGuard)
  public async refresh(
    @Res({ passthrough: true }) res: Response,
    @Headers('refreshToken') refreshToken: string,
    @GetUser() user: UserEntity,
  ) { 
    if( this.authService.validationRefreshToken(refreshToken, user.github_id) ) {
      const accessToken = await this.authService.createAccessToken(user.id);
      
      return accessToken;
    }
  }
  
  @ApiOperation({ summary: 'user 로그아웃' })
  @Get('/logout')
  @UseGuards(JwtRefreshTokenGuard)
  public async logOut(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserEntity,
  ) {
    const refreshOption = this.authService.getCookiesForLogOut();
    this.authService.deleteRefreshToken(user.id);
    res.cookie('refreshToken', refreshOption);

    return 'logout success';
  }
}