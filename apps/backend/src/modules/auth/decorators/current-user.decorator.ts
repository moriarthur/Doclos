import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Part 4: API Specification - Current User Decorator

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
