import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../schemas/user.schema';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    let request: any;

    if (ctx.getType() === 'http') {
      request = ctx.switchToHttp().getRequest();
    } else if (ctx.getType() === 'rpc') {
      request = ctx.switchToRpc().getData();
    }

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
