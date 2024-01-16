import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<TUser>(
    err: Record<string, any>,
    user: TUser,
    info: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        error: err?.message || info?.message,
      });
    }

    return user;
  }
}
