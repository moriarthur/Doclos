import { IsEmail, IsString, MinLength } from 'class-validator';

// Part 4: API Specification - Register DTO

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  password: string;

  @IsString()
  name: string;
}
