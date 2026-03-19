import { IsEmail, IsString, MinLength } from 'class-validator';

// Part 4: API Specification - Login DTO

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
