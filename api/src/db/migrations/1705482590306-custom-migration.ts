import { MigrationInterface } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { CommandsModule } from '@/commands/commands.module';
import { SystemSeedService } from '@/commands/service/seeds';

export class CustomMigration1705482590306 implements MigrationInterface {
  public async up(): Promise<void> {
    const context = await NestFactory.createApplicationContext(CommandsModule);
    const service = context.get(SystemSeedService);
    await service.run();
  }

  public async down(): Promise<void> {}
}
