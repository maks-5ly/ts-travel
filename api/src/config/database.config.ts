import { registerAs } from '@nestjs/config';

import { DataSourceOptions } from 'typeorm';

import { TypeormSnakeCaseNamingStrategy } from '@/db/naming-strategy';
import { join } from 'node:path';
import { SeederOptions } from 'typeorm-extension';

export default registerAs(
  'database',
  (): Record<string, boolean | (DataSourceOptions & SeederOptions)> => ({
    debug: process.env.DATABASE_DEBUG === 'true',
    autoCreateDB: process.env.AUTO_CREATE_DB === 'true',
    connection: {
      type: 'postgres',
      applicationName: process.env.APP_NAME || 'travels',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      database: process.env.POSTGRES_DB || 'travels',
      password: process.env.POSTGRES_PASSWORD || null,
      username: process.env.POSTGRES_USER,
      logging: process.env.DATABASE_DEBUG === 'true',
      entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, `/../db/migrations/**/*{.ts,.js}`)],
      seeds: [join(__dirname, `/../db/seeds/**/*{.ts,.js}`)],
      namingStrategy: new TypeormSnakeCaseNamingStrategy(),
      migrationsTransactionMode: 'each',
      migrationsRun: false,
      synchronize: false,
      useUTC: true,
    },
  }),
);
