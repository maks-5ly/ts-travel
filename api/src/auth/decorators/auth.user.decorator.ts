import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/user/entities';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ContextAuthUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): User | null => {
    const context = GqlExecutionContext.create(ctx);
    const { __user: user } = context.getContext();
    return key ? user?.[key] : user;
  },
);
