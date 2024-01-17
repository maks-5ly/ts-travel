import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/services';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '@/roles/type';

@Injectable()
export default class UserSeeder implements Seeder {
  constructor(private readonly userService: UserService) {}
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY;');

    await this.userService.create({
      email: faker.internet.email(),
      password: '12345678',
      roles: faker.helpers.arrayElements(Object.values(RoleEnum), {
        min: 1,
        max: 2,
      }),
    });
  }
}
