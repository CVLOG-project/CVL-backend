import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { GithubCodeDto } from './users.dto';
import { UsersRepository } from './users.repository';

export interface IGithubUserTypes {
  githubId: string;
  avatar: string;
  name: string;
  description: string;
  location: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService
    ){}
  
  public async getGithubInfo(githubCodeDto: GithubCodeDto): Promise<{ accessToken: string }> {
    const { code } = githubCodeDto;
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';

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
      throw new BadRequestException('깃허브 인증을 실패했습니다.');
    }

    const { access_token } = response.data;
    
    const getUserUrl: string = 'https://api.github.com/user';
    
    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { login, avatar_url, name, bio, company } = data;
    
    const githubInfo: IGithubUserTypes = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company
    };

    const found = await this.usersRepository.getOneUser(githubInfo.githubId);
    
    if(!found){
      await this.usersRepository.createUser(
        githubInfo.name,
        githubInfo.githubId,
        "",   // refresh token
        githubInfo.description,
        githubInfo.avatar
      )
    }
    const id = found.id;

    const payload = { id };
    const accessToken = await this.jwtService.sign(payload);
    
    return { accessToken };
  }

  
}