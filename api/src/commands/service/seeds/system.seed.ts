import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '@/user/entities';
import { Role } from '@/roles/entities';
import { RoleEnum } from '@/roles/type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemSeedService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async run() {
    return this.dataSource.transaction('SERIALIZABLE', async (em) => {
      const userRepository = em.getRepository(User);
      const rolesRepository = em.getRepository(Role);

      const adminEmail = this.configService.get<string>(
        'app.system.admin.email',
      );
      const password = this.configService.get<string>(
        'app.system.admin.password',
      );

      const existingUser = await userRepository.findOne({
        where: { email: adminEmail },
      });

      const roles = rolesRepository.create(
        Object.values(RoleEnum).map((role) => ({
          name: role,
        })),
      );

      await rolesRepository.upsert(roles, {
        conflictPaths: ['name'],
        skipUpdateIfNoValuesChanged: true,
        upsertType: 'on-conflict-do-update',
      });

      const adminRole = await rolesRepository.findOne({
        where: {
          name: RoleEnum.ADMIN,
        },
      });

      if (!existingUser) {
        await userRepository.save(
          userRepository.create({
            email: adminEmail,
            password: password,
            roles: [adminRole],
          }),
        );
      }
    });
  }
}
