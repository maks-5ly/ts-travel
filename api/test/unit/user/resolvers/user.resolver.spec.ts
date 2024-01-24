import { Test } from '@nestjs/testing';
import { UserResolver } from '@/user/resolvers/user.resolver';
import { UserService } from '@/user/services/user.service';
import { DataSource } from 'typeorm';
import { MockType } from '../../../types';
import { User } from '@/user/entities';
import { faker } from '@faker-js/faker';
import { CreateUserInput, RemoveUserInput, UpdateUserInput } from '@/user/dto';
import { RoleEnum } from '@/roles/type';
import { Role } from '@/roles/entities';
import { serviceMockFactory } from '../../../factories';

describe('UserResolver', () => {
  let resolverMock: UserResolver;
  let userServiceMock: MockType<UserService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useFactory: serviceMockFactory<UserService>(),
        },
        {
          provide: DataSource,
          useFactory: serviceMockFactory<DataSource>(),
        },
      ],
    }).compile();

    resolverMock = module.get<UserResolver>(UserResolver);
    userServiceMock = module.get<MockType<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(resolverMock).toBeDefined();
  });

  describe('findAll', () => {
    it('should call user service correct method with correct payload', () => {
      resolverMock.findAll();
      expect(userServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findAll).toHaveBeenCalledWith();
    });

    it('should return an empty array when no users exist', async () => {
      userServiceMock.findAll.mockReturnValue([]);

      const result = await resolverMock.findAll();

      expect(result).toEqual([]);
      expect(userServiceMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return all users', async () => {
      const users = [
        new User({ id: faker.string.uuid() }),
        new User({ id: faker.string.uuid() }),
      ];
      userServiceMock.findAll.mockImplementation(
        jest.fn(() => Promise.resolve(users)),
      );

      const result = await resolverMock.findAll();

      expect(result).toEqual(users);
      expect(userServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should call user service update method with correct payload', async () => {
      const updateUserInput: UpdateUserInput = {
        id: faker.string.uuid(),
        roles: [RoleEnum.ADMIN],
      };

      await resolverMock.updateUser(updateUserInput);

      expect(userServiceMock.update).toHaveBeenCalledTimes(1);
      expect(userServiceMock.update).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
    });

    it('should return updated user', async () => {
      const updateUserInput: UpdateUserInput = {
        id: faker.string.uuid(),
        roles: [RoleEnum.ADMIN],
      };

      const user = new User({
        id: updateUserInput.id,
        roles: updateUserInput.roles.map(
          (role) =>
            new Role({
              id: faker.string.uuid(),
              name: role,
            }),
        ),
      });

      userServiceMock.update.mockImplementation(
        jest.fn(() => Promise.resolve(user)),
      );

      const result = await resolverMock.updateUser(updateUserInput);

      expect(result).toEqual(user);
      expect(userServiceMock.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user does not exist', async () => {
      const updateUserInput: UpdateUserInput = {
        id: faker.string.uuid(),
      };

      userServiceMock.update.mockImplementation(
        jest.fn(() => Promise.reject(new Error('User not found'))),
      );

      await expect(resolverMock.updateUser(updateUserInput)).rejects.toThrow(
        'User not found',
      );
      expect(userServiceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should call user service create method with correct payload', async () => {
      const createUserInput: CreateUserInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        roles: [RoleEnum.ADMIN],
      };

      resolverMock.createUser(createUserInput);

      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
      expect(userServiceMock.create).toHaveBeenCalledWith(createUserInput);
    });

    it('should return created user', async () => {
      const createUserInput: CreateUserInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        roles: [RoleEnum.ADMIN],
      };

      const createdUser = new User({
        ...createUserInput,
        roles: createUserInput.roles.map(
          (role) => new Role({ id: faker.string.uuid(), name: role }),
        ),
      });
      userServiceMock.create.mockImplementation(
        jest.fn(() => Promise.resolve(createdUser)),
      );

      const result = await resolverMock.createUser(createUserInput);

      expect(result).toEqual(createdUser);
      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserInput: CreateUserInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        roles: [RoleEnum.ADMIN],
      };

      userServiceMock.create.mockImplementation(
        jest.fn(() => Promise.reject(new Error('User creation failed'))),
      );

      await expect(resolverMock.createUser(createUserInput)).rejects.toThrow(
        'User creation failed',
      );
      expect(userServiceMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeUser', () => {
    it('should call user service remove method with correct id', async () => {
      const removeUserInput: RemoveUserInput = {
        id: faker.string.uuid(),
      };

      await resolverMock.removeUser(removeUserInput);

      expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(userServiceMock.remove).toHaveBeenCalledWith(removeUserInput.id);
    });

    it('should return removed user', async () => {
      const removeUserInput: RemoveUserInput = {
        id: faker.string.uuid(),
      };

      const removedUser = new User({ id: removeUserInput.id });
      userServiceMock.remove.mockImplementation(
        jest.fn(() => Promise.resolve(removedUser)),
      );

      const result = await resolverMock.removeUser(removeUserInput);

      expect(result).toEqual(removedUser);
      expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user removal fails', async () => {
      const removeUserInput: RemoveUserInput = {
        id: faker.string.uuid(),
      };

      userServiceMock.remove.mockImplementation(
        jest.fn(() => Promise.reject(new Error('User removal failed'))),
      );

      await expect(resolverMock.removeUser(removeUserInput)).rejects.toThrow(
        'User removal failed',
      );
      expect(userServiceMock.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('roles', () => {
    it('should call user service getUserRoles method with correct user', async () => {
      const user = new User({ id: faker.string.uuid() });

      resolverMock.roles(user);

      expect(userServiceMock.getUserRoles).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserRoles).toHaveBeenCalledWith(user);
    });

    it('should return user roles', async () => {
      const user = new User({ id: faker.string.uuid() });
      const roles = [
        new Role({ id: faker.string.uuid(), name: RoleEnum.ADMIN }),
      ];

      userServiceMock.getUserRoles.mockImplementation(
        jest.fn(() => Promise.resolve(roles)),
      );

      const result = await resolverMock.roles(user);

      expect(result).toEqual(roles);
      expect(userServiceMock.getUserRoles).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if getting user roles fails', async () => {
      const user = new User({ id: faker.string.uuid() });

      userServiceMock.getUserRoles.mockImplementation(
        jest.fn(() => Promise.reject(new Error('Failed to get user roles'))),
      );

      await expect(resolverMock.roles(user)).rejects.toThrow(
        'Failed to get user roles',
      );
      expect(userServiceMock.getUserRoles).toHaveBeenCalledTimes(1);
    });
  });
});
