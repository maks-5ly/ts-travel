import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEnrichGuard } from '@/auth/guard/user-enrich.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { faker } from '@faker-js/faker';
import { User } from '@/user/entities';
import { IRequestContext } from '@/utils/request/type/request.interface';

describe('UserEnrichGuard', () => {
  const mockExecutionContext: ExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnThis(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  let guard: UserEnrichGuard;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserEnrichGuard,
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              findOne: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<UserEnrichGuard>(UserEnrichGuard);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when user is not present in context', async () => {
    const context = {
      getContext: jest.fn().mockReturnValue({
        req: { user: null },
      }),
    };

    jest
      .spyOn(guard, 'getGqlContext')
      .mockReturnValue(context as unknown as GqlExecutionContext);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should enrich context with user when user is present in context', async () => {
    const user = new User({
      id: faker.string.uuid(),
    });

    const context = {
      getContext: jest.fn().mockReturnValue({
        req: { user },
        __user: null,
      }),
    };

    jest
      .spyOn(guard, 'getGqlContext')
      .mockReturnValue(context as unknown as GqlExecutionContext);

    jest.spyOn(dataSource, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(user),
    } as unknown as Repository<User>);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(context.getContext().__user).toBe(user);
  });

  it('should handle case when user is not found in the database', async () => {
    const user = new User({
      id: faker.string.uuid(),
    });

    const context = {
      getContext: jest.fn().mockReturnValue({
        req: { user },
        __user: null,
      } as IRequestContext),
    };

    jest
      .spyOn(guard, 'getGqlContext')
      .mockReturnValue(context as unknown as GqlExecutionContext);

    jest.spyOn(dataSource, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    } as unknown as Repository<User>);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(context.getContext().__user).toBeNull();
  });
});
