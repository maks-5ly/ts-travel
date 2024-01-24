import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';

import { UserService } from '@/user/services/user.service';
import { User } from '@/user/entities';
import { RolesService } from '@/roles/services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '@/auth/service';
import { CreateUserInput } from '@/user/dto';
import { RoleEnum } from '@/roles/type';
import { Role } from '@/roles/entities';
import { repositoryMockFactory, serviceMockFactory } from '../../../factories';
import { MockType } from '../../../types';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: MockType<Repository<User>>;
  let authServiceMock: MockType<AuthService>;
  let roleServiceMock: MockType<RolesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory<User>(User),
        },
        {
          provide: RolesService,
          useFactory: serviceMockFactory<RolesService>(),
        },
        {
          provide: AuthService,
          useFactory: serviceMockFactory<AuthService>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepositoryMock = module.get<MockType<Repository<User>>>(
      getRepositoryToken(User),
    );
    authServiceMock = module.get<MockType<AuthService>>(AuthService);
    roleServiceMock = module.get<MockType<RolesService>>(RolesService);
    roleServiceMock.findRolesByNames.mockImplementation(
      (roles?: RoleEnum[]) => {
        if (!roles) {
          return null;
        }

        return roles.map(
          (role) =>
            new Role({
              id: faker.string.uuid(),
              name: role,
            }),
        );
      },
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let user1: User;
    let user2: User;
    beforeEach(() => {
      user1 = new User({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        createdAt: faker.date.recent(),
      });

      user2 = new User({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        createdAt: faker.date.future({ refDate: user1.createdAt }),
      });

      userRepositoryMock.find.mockReturnValue([user2, user1]);
    });

    it('should return list of users', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);

      expect(result).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining(user1),
          expect.objectContaining(user2),
        ]),
      );
    });

    it('should call user repository to fetch users from data source', async () => {
      await service.findAll();
      expect(userRepositoryMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    let passwordHash: string;

    const userInput: CreateUserInput = {
      email: faker.internet.email(),
      password: faker.string.uuid(),
    };

    beforeEach(() => {
      passwordHash = faker.string.uuid();
      authServiceMock.createPassword.mockReturnValue({
        passwordHash,
      });
    });

    it('return new User entity', async () => {
      const result = await service.create(userInput);

      expect(result).toBeInstanceOf(User);
    });

    it('should return entity for provided input', async () => {
      const result = await service.create(userInput);

      expect(result).toMatchObject({
        id: expect.any(String),
        email: userInput.email,
      });
    });

    it('should return entity with hashed password', async () => {
      const result = await service.create(userInput);

      expect(result).toMatchObject({
        email: userInput.email,
        password: passwordHash,
      });
    });

    it('should return entity with given roles', async () => {
      const expectedRole = RoleEnum.ADMIN;

      const result = await service.create({
        ...userInput,
        roles: [expectedRole],
      });

      expect(result.roles).toHaveLength(1);
      const role = result.roles[0];

      expect(role).toBeInstanceOf(Role);
      expect(role).toMatchObject({
        id: expect.any(String),
        name: expectedRole,
      });
    });

    it('should call repository methods to save entity', async () => {
      await service.create(userInput);
      expect(roleServiceMock.findRolesByNames).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it('should call createPassword function to generate hash from password', async () => {
      await service.create(userInput);
      expect(authServiceMock.createPassword).toHaveBeenCalledTimes(1);
      expect(authServiceMock.createPassword).toHaveBeenCalledWith<[string]>(
        userInput.password,
      );
    });
  });

  describe('remove', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
      });

      userRepositoryMock.findOneOrFail.mockImplementation(jest.fn(() => user));
    });

    it('should fail if user is not found', async () => {
      userRepositoryMock.findOneOrFail.mockImplementation(() => {
        throw new Error('expected error');
      });

      const result = () => service.remove(user.id);

      expect(result).rejects.toThrowError();
    });

    it('should return removed entity', async () => {
      const result = await service.remove(user.id);

      expect(result).toBeInstanceOf(User);
    });

    it('should return removed entity without id', async () => {
      const result = await service.remove(user.id);

      expect(result.id).not.toBeDefined();
    });

    it('should return the a relevant entity according to condition', async () => {
      const result = await service.remove(user.id);

      expect(result.email).toBe(user.email);
    });

    it('should call correct repository method with correct payload', async () => {
      const userId = user.id;
      await service.remove(user.id);

      expect(userRepositoryMock.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
      expect(userRepositoryMock.remove).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.remove).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
        roles: [
          new Role({
            id: faker.string.uuid(),
            name: RoleEnum.EDITOR,
          }),
        ],
      });

      userRepositoryMock.findOneOrFail.mockReturnValue(user);
    });

    it('should fail if user is not found', async () => {
      userRepositoryMock.findOneOrFail.mockImplementation(() => {
        throw new Error('expected error');
      });

      const result = () =>
        service.update(user.id, {
          id: user.id,
        });

      expect(result).rejects.toThrowError();
    });

    it('should return updated entity', async () => {
      const result = await service.update(user.id, {
        id: user.id,
      });

      expect(result).toBeInstanceOf(User);
    });

    it('should update roles correctly', async () => {
      const expectedRole = RoleEnum.ADMIN;
      const result = await service.update(user.id, {
        id: user.id,
        roles: [expectedRole],
      });

      expect(roleServiceMock.findRolesByNames).toHaveBeenCalledTimes(1);
      expect(result.roles).toHaveLength(1);
      expect(result.roles[0]).toMatchObject({
        id: expect.any(String),
        name: expectedRole,
      });
    });

    it('should update remove roles assigned to user', async () => {
      const result = await service.update(user.id, {
        id: user.id,
      });

      expect(result.roles).toBe(null);
    });

    it('should fail if user is not found', async () => {
      userRepositoryMock.findOneOrFail.mockImplementation(() => {
        throw new Error('expected error');
      });

      const result = () =>
        service.update(user.id, {
          id: user.id,
        });

      expect(result()).rejects.toThrowError();
    });

    it('should not search roles if Roles are not provided in input', async () => {
      await service.update(user.id, {
        id: user.id,
      });

      expect(roleServiceMock.findRolesByNames).not.toHaveBeenCalled();
    });

    it('should call repository methods to update entity', async () => {
      await service.update(user.id, {
        id: user.id,
      });

      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({ ...user, roles: null }),
      );
    });
  });

  describe('getUserRoles', () => {
    let user: User;
    const userRole = new Role({
      id: faker.string.uuid(),
      name: RoleEnum.ADMIN,
    });

    beforeEach(() => {
      user = new User({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: faker.string.uuid(),
        roles: [userRole],
      });

      userRepositoryMock.findOneOrFail.mockReturnValue(user);
    });

    it('should fail if user is not found', () => {
      userRepositoryMock.findOneOrFail.mockImplementation(() => {
        throw new Error('expected error');
      });

      const result = () => service.getUserRoles(user);

      expect(result).rejects.toThrowError();
    });

    it('should return array of user roles', async () => {
      const result = await service.getUserRoles(user);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should correctly return array of user roles', async () => {
      const result = await service.getUserRoles(user);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result).toMatchObject([userRole]);
    });

    it('should return empty array if user does not have roles', async () => {
      delete user.roles;
      userRepositoryMock.findOneOrFail.mockReturnValue(user);
      const result = await service.getUserRoles(user);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should call repository method with correct paload', async () => {
      await service.getUserRoles(user);

      expect(userRepositoryMock.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        relations: ['roles'],
      });
    });
  });
});
