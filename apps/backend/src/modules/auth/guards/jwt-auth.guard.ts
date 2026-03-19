import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Part 4: API Specification - JWT Guard

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
