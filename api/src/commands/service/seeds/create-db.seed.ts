import { ConfigService } from '@nestjs/config';

import { Command, CommandRunner } from 'nest-commander';
import { DataSourceOptions } from 'typeorm';
import { createDB } from '@/db/utils';

@Command({
  name: 'create:db',
  description: 'create default db',
})
export class CreateDbSeed extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(): Promise<void> {
    if (this.configService.get<boolean>('database.autoCreateDB')) {
      await createDB(this.configService.get<DataSourceOptions>(`database`));
    }
  }
}
