import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { Repository } from 'typeorm';
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

  async create({ email, password, roles: rolesInput }: CreateUserInput) {
    const roles = await this.rolesService.findRolesByNames(rolesInput);

    if (!roles?.length) {
      throw new UnprocessableEntityException({
        message: 'User can not be created without role',
      });
    }

    const { passwordHash } = await this.authService.createPassword(password);
    return this.userRepository.save(
      this.userRepository.create({
        email,
        password: passwordHash,
        roles,
      }),
    );
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
        await this.userRepository.findOne({
          where: {
            id: user.id,
          },
          relations: ['roles'],
        })
      ).roles || []
    );
  }
}
