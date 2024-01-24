import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { Role } from '@/roles/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '@/roles/type/roles.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findRolesByNames(roles: RoleEnum[], entityManager?: EntityManager) {
    const repository = entityManager
      ? entityManager.getRepository(Role)
      : this.rolesRepository;
    return repository.find({
      where: {
        name: In(roles),
      },
    });
  }

  async findAll() {
    return this.rolesRepository.find();
  }
}
