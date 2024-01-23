import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserAclGuard } from '@/auth/guard/user-acl.guard';
import { serviceMockFactory } from '../../../factories';
import { MockType } from '../../../types';
import { RoleEnum } from '@/roles/type';
import { GqlExecutionContext } from '@nestjs/graphql';

describe.skip('UserAclGuard', () => {
  let guard: UserAclGuard;
  let reflector: MockType<Reflector>;

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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserAclGuard,
        {
          provide: Reflector,
          useFactory: serviceMockFactory<Reflector>(),
        },
      ],
    }).compile();

    guard = moduleRef.get<UserAclGuard>(UserAclGuard);
    reflector = moduleRef.get<MockType<Reflector>>(Reflector);
  });

  it('should allow access if no role is required', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access if user is not found', async () => {
    reflector.getAllAndOverride.mockReturnValue(RoleEnum.ADMIN);

    jest.spyOn(guard, 'getGqlContext').mockReturnValue({
      getContext: () => ({ __user: null }),
    } as GqlExecutionContext);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
  });

  it('should allow access for admin role', async () => {
    reflector.getAllAndOverride.mockReturnValue(RoleEnum.ADMIN);
    jest.spyOn(guard, 'getGqlContext').mockReturnValue({
      getContext: () => ({
        __user: { roles: [{ name: RoleEnum.ADMIN }] },
      }),
    } as GqlExecutionContext);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access for non-admin role', async () => {
    reflector.getAllAndOverride.mockReturnValue(RoleEnum.ADMIN);
    jest.spyOn(guard, 'getGqlContext').mockReturnValue({
      getContext: () => ({
        __user: { roles: [{ name: RoleEnum.EDITOR }] },
      }),
    } as GqlExecutionContext);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });

  it('should allow access for editor role', async () => {
    reflector.getAllAndOverride.mockReturnValue(RoleEnum.EDITOR);
    jest.spyOn(guard, 'getGqlContext').mockReturnValue({
      getContext: () => ({
        __user: { roles: [{ name: RoleEnum.EDITOR }] },
      }),
    } as GqlExecutionContext);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access for non-editor role', async () => {
    reflector.getAllAndOverride.mockReturnValue(RoleEnum.EDITOR);
    jest.spyOn(guard, 'getGqlContext').mockReturnValue({
      getContext: () => ({
        __user: { roles: [] },
      }),
    } as GqlExecutionContext);
    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
