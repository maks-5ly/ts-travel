import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@/user/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '@/roles/services';
import { AuthService } from '@/auth/service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
  ) {}

  async create(
    { email, password, roles: rolesInput }: CreateUserInput,
    entityManager?: EntityManager,
  ) {
    const roles = await this.rolesService.findRolesByNames(
      rolesInput,
      entityManager,
    );
    if (rolesInput?.length && !roles?.length) {
      throw new UnprocessableEntityException({
        message: 'User can not be created without role',
      });
    }

    const repository = entityManager
      ? entityManager.getRepository(User)
      : this.userRepository;

    const { passwordHash } = await this.authService.createPassword(password);
    return repository.save(
      repository.create({
        email,
        password: passwordHash,
        roles,
      }),
    );
  }

  findAll() {
    return this.userRepository.find();
  }

  findBy(keys: Partial<User>, relations?: string[]) {
    return this.userRepository.findOneOrFail({
      where: {
        ...keys,
      },
      relations,
    });
  }

  async update(
    id: string,
    { roles: rolesInput, ...restInput }: UpdateUserInput,
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
    });

    let roles = null;
    if (rolesInput) {
      roles = await this.rolesService.findRolesByNames(rolesInput);
    }

    return this.userRepository.save({
      ...user,
      ...restInput,
      roles,
    });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return this.userRepository.remove(user);
  }

  async getUserRoles(user: User) {
    return (
      (
        await this.userRepository.findOneOrFail({
          where: {
            id: user.id,
          },
          relations: ['roles'],
        })
      ).roles || []
    );
  }
}
