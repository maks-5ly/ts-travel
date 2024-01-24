import { MigrationInterface } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { CommandsModule } from '@/commands/commands.module';
import { SystemSeedService } from '@/commands/service/seeds';
import * as process from 'process';

export class CustomMigration1705482590306 implements MigrationInterface {
  public async up(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      const app = await NestFactory.createApplicationContext(CommandsModule);
      const systemSeedService = app.get<SystemSeedService>(SystemSeedService);
      await systemSeedService.run();
      await app.close();
    }
  }

  public async down(): Promise<void> {}
}
