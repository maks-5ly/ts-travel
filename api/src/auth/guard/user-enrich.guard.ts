import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestContext } from '@/utils/request/type/request.interface';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '@/user/entities';

@Injectable()
export class UserEnrichGuard implements CanActivate {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getGqlContext(context: ExecutionContext) {
    return GqlExecutionContext.create(context);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const context = this.getGqlContext(ctx).getContext<IRequestContext>();

    const {
      req: { user },
    } = context;

    if (!user) {
      return true;
    }

    context.__user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: user.id,
      },
      relations: ['roles'],
    });

    return true;
  }
}
