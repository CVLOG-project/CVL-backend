import {
  BadRequestException,
  Injectable,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { UsersRepository } from '../users/users.repository';
import { GithubCodeDto, GithubUserDto } from '../users/users.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService
  ){}

  public async getGithubInfo(
  githubCodeDto: GithubCodeDto,
  @Res({ passthrough: true }) res: Response
  ): Promise<{ accessToken: string }> {
    const { code } = githubCodeDto;
    const getTokenUrl = 'https://github.com/login/oauth/access_token';

    const request = {
      code,
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json',
      }
    });

    if (response.data.error) {
      throw new BadRequestException('failed Github authentication');
    }

    const { access_token } = response.data;
    
    const getUserUrl = 'https://api.github.com/user';
    
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { login, avatar_url, name, bio, company } = data;
    
    const githubInfo: GithubUserDto = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company
    };
    
    const githubId = githubInfo.githubId; 
    const getUserIdByUserGithubId = await this.usersRepository.getOneUserByGithubId(githubId);
    const id = getUserIdByUserGithubId?.id;
    const accessToken = await this.createAccessToken(id);
    const refreshToken = await this.createRefreshToken(id);
    const found = await this.usersRepository.getOneUserByGithubId(githubId);
    
      if(!found){
        await this.usersRepository.createUser(
          githubInfo.name,
          githubId,
          refreshToken,
          githubInfo.description,
          githubInfo.avatar
        );
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)
    });

    return accessToken;
  }
  
  async createAccessToken(id: number): Promise<{ accessToken: string }>{
    const payload = { id };
    const accessToken= await this.jwtService.sign(payload);

    return { accessToken };
  }

  async createRefreshToken(id: number) {
    const payload = { id };
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    });
    
    await this.usersRepository.updateRefreshTokenInUser(id, refreshToken);

    return refreshToken;
  }

  async validationRefreshToken( refreshToken: string, github_id: string ){
    const user = await this.usersRepository.getOneUserByGithubId(github_id);
    if(refreshToken !== user.refresh_token){
      throw new UnauthorizedException(
        'error.refreshTokenvailed'
      );
    } 

    return true;    
  }

  async getCookiesForLogOut() {
    return {
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: 'true',
        maxAge: 0,
      }
    };
  }

  async deleteRefreshToken(id: number) {
    const refreshToken = await this.createRefreshToken(id);
    await this.usersRepository.deleteRefreshTokenInUser(id, refreshToken);
  }

  async validationAccessToken(
    accessToken: string,
    ignoreExpiration?:boolean
  ) {
    try{
      const payload = await this.jwtService.verifyAsync(
        accessToken,
        { ignoreExpiration }
      );

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'error.expiredToken'
        );
      }
      else if ( error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'error.invailedToken'
        );
       }
      else {
        throw error;
      }
    }
  }
}