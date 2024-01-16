import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    debug: process.env.APP_DEBUG === 'true',
    isProduction: process.env.APP_ENV === 'production',
    isDevelopment: process.env.APP_ENV === 'development',
    name: process.env.APP_NAME || 'api',
    env: process.env.APP_ENV || 'development',
    language: process.env.APP_LANGUAGE || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    version: process.env.APP_VERSION || '1',
    http: {
      host: process.env.APP_HOST || 'localhost',
      port: Number.parseInt(process.env.APP_PORT) || 3000,
      timeout: process.env.MIDDLEWARE_TIMEOUT
        ? ms(process.env.MIDDLEWARE_TIMEOUT)
        : ms('30s'),
    },

    httpOn: process.env.APP_HTTP_ON === 'true',
  }),
);
