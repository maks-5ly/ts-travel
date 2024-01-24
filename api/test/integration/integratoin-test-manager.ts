import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SystemSeedService } from '@/commands/service/seeds';
import { CommandsModule } from '@/commands/commands.module';
import { AuthService } from '@/auth/service';
import { UserService } from '@/user/services';
import { User } from '@/user/entities';
import { ConfigService } from '@nestjs/config';

export class IntegrationTestManager {
  private static app: INestApplication;
  private static dataSource: DataSource;

  private static server: any;

  static async beforeAll() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication({
      bodyParser: true,
      rawBody: true,
    });

    await this.app.init();

    this.server = this.app.getHttpServer();
    this.dataSource = this.app.get<DataSource>(DataSource);

    return this.dataSource.runMigrations({ transaction: 'all' });
  }

  static async beforeEach() {
    try {
      const seedModule = await Test.createTestingModule({
        imports: [CommandsModule],
      }).compile();

      const systemSeedService =
        seedModule.get<SystemSeedService>(SystemSeedService);

      await systemSeedService.run();
    } catch (e) {
      console.log('!_ERROR_!', e);
      throw e;
    }
  }

  static async afterEach() {
    const entities = this.dataSource.entityMetadatas;

    return await Promise.all(
      entities.map(async (entity) => {
        const repository = this.dataSource.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
      }),
    );
  }

  public static getHttpServer() {
    return this.server;
  }

  public static getService<T>(serviceClass: any): T {
    return this.app.get<T>(serviceClass);
  }

  static async getAuthorizedUserToken(user?: User): Promise<string> {
    const userService = this.app.get<UserService>(UserService);
    const configService = this.app.get<ConfigService>(ConfigService);
    const auth = this.app.get<AuthService>(AuthService);

    let authUser = user;

    if (!user) {
      const adminEmail = configService.get<string>('app.system.admin.email');
      authUser = await userService.findBy({ email: adminEmail });
    }

    return auth.createAccessTokenForUser(authUser);
  }
}
