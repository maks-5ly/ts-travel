import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { DataSourceOptions } from 'typeorm';

import { createDB } from '@/db/utils';

@Injectable()
export class TypeormDbService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    if (this.configService.get<boolean>('database.autoCreateDB')) {
      await createDB(
        this.configService.get<DataSourceOptions>(`database.connection`),
      );
    }

    return this.configService.get(`database.connection`);
  }
}
