import { registerAs } from '@nestjs/config';

import ms from 'ms';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY || '123456',
        expirationTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '1d',
        notBeforeExpirationTime: ms(0),
      },

      refreshToken: {
        secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY || '123456000',
        expirationTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED || '7d',
        expirationTimeRememberMe:
          process.env.AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED || '30d',
        notBeforeExpirationTime:
          process.env.AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION || '30m',
      },
    },
    password: {
      saltLength: 8,
    },
  }),
);
