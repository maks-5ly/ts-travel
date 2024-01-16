import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_ROLE_META_KEY } from '@/auth/constant';
import { IRequestContext } from '@/utils/request/type/request.interface';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleEnum } from '@/roles/type';

@Injectable()
export class UserAclGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getGqlContext(context: ExecutionContext) {
    return GqlExecutionContext.create(context);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<RoleEnum>(
      AUTH_ROLE_META_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRole) {
      return true;
    }

    const { __user: user } =
      this.getGqlContext(ctx).getContext<IRequestContext>();

    if (!user) {
      throw new BadRequestException({
        message: 'User Not Found',
      });
    }

    const rolesMap = user.roles.reduce((acc, role) => {
      acc.set(role.name, role);
      return acc;
    }, new Map());

    if (requiredRole === RoleEnum.ADMIN) {
      return rolesMap.has(RoleEnum.ADMIN);
    }

    if (requiredRole === RoleEnum.EDITOR) {
      return rolesMap.has(RoleEnum.ADMIN) || rolesMap.has(RoleEnum.EDITOR);
    }

    return false;
  }
}
