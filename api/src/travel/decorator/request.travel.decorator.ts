import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Travel } from '@/travel/entities/travel.entity';

export const ContextTravel = createParamDecorator(
  (key: string, ctx: ExecutionContext): Travel | null => {
    const context = GqlExecutionContext.create(ctx);
    const { __travel: travel } = context.getContext();
    return key ? travel?.[key] : travel;
  },
);
