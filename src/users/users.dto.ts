import { IsString } from 'class-validator';

export class GithubUserDto {
  @IsString()
  readonly githubId: string;

  @IsString()
  readonly avatar: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly location: string;
}

export class GithubCodeDto {
  @IsString()
  readonly code: string;
}
