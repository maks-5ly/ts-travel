import { MockType, MockOptions } from '../types';
import { createMock } from '@golevelup/ts-jest';

export const serviceMockFactory =
  <T>(args?: MockOptions<T>) =>
  (): MockType<T> =>
    createMock(args);
