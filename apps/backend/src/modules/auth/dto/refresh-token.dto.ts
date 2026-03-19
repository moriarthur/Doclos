import { IsString } from 'class-validator';

// Part 4: API Specification - Refresh Token DTO

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
