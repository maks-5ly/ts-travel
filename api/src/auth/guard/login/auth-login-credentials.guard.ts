import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { isEmail, isNotEmpty } from 'class-validator';
import { DataSource } from 'typeorm';
import normalizeEmail from 'validator/lib/normalizeEmail';

import { AuthService } from '@/auth/service';
import { User } from '@/user/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthLoginInput } from '@/auth/dto';
import { IRequestContext } from '@/utils/request/type/request.interface';

@Injectable()
export class AuthLoginCredentialsGuard implements CanActivate {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    private readonly authService: AuthService,
  ) {}

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(ctx);
    const { loginInput: { email, password } = {} } = context.getArgs<{
      loginInput: AuthLoginInput;
    }>();

    const normalizedEmail = isEmail(email) && normalizeEmail(email);

    if (!(normalizedEmail && isNotEmpty(password))) {
      throw new BadRequestException({
        message: 'Bad Credentials',
      });
    }

    const user = await this.defaultDataSource.getRepository(User).findOne({
      where: {
        email: normalizedEmail,
      },
    });

    const isValid =
      user?.password &&
      (await this.authService.validateUserPassword(password, user.password));

    if (!isValid) {
      throw new BadRequestException({
        message: 'Bad Credentials',
      });
    }

    const gqlContext = context.getContext<IRequestContext>();
    gqlContext.__user = user;

    return true;
  }
}
