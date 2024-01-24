import { ConfigModule } from '@nestjs/config';
import AppConfig from './app.config';
import AuthConfig from './auth.config';
import DbConfig from './database.config';
import ThrottleConfig from './throttle.config';
import MiddlewareConfig from './middleware.config';
import * as process from 'process';

export const Configs = [
  AppConfig,
  DbConfig,
  AuthConfig,
  ThrottleConfig,
  MiddlewareConfig,
];

export const ConfigModuleRoot = ConfigModule.forRoot({
  load: Configs,
  ignoreEnvFile: false,
  isGlobal: true,
  cache: true,
  envFilePath: [process.env.NODE_ENV === 'test' ? '.env.test' : '.env'],
  expandVariables: true,
});
