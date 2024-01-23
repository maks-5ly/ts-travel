import { MockOptions, MockType } from '../types';
import { DeepPartial, Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { BaseEntity } from '@/db/entity';
import { faker } from '@faker-js/faker';
import { omit } from 'lodash';

export const repositoryMockFactory =
  <T extends BaseEntity<T>>(
    entityClass: new (props: DeepPartial<T>) => T,
    args?: MockOptions<T>,
  ) =>
  (): MockType<Repository<T>> => {
    // @ts-expect-error mock
    return createMock<Repository<T>>({
      save: jest.fn((entity) => {
        if (!(entity instanceof entityClass)) {
          return new entityClass(entity);
        }
        return entity;
      }),
      create: jest.fn((entityData) => {
        const entity = new entityClass(entityData);

        if (!entity.id) {
          entity.id = faker.string.uuid();
        }

        return entity;
      }),
      remove: jest.fn((entity) => {
        if (!(entity instanceof entityClass)) {
          return new entityClass(omit(entity, ['id']) as DeepPartial<T>);
        }
        delete entity.id;
        return entity;
      }),
      ...args,
    });
  };
