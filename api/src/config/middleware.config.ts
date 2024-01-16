import { registerAs } from '@nestjs/config';

import ms from 'ms';

import { RequestMethodEnum } from '@/utils/request/constant';

export default registerAs(
  'middleware',
  (): Record<string, any> => ({
    cors: {
      allowMethod: [
        RequestMethodEnum.GET,
        RequestMethodEnum.DELETE,
        RequestMethodEnum.PUT,
        RequestMethodEnum.PATCH,
        RequestMethodEnum.POST,
      ],
      allowOriginProduction: [
        // TODO: add origins for prod
      ],
      allowOriginLocalhost: [/^https?:\/\/localhost:3000$/],
      allowHeader: [
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        'Origin',
        'Authorization',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Referer',
        'Host',
        'X-Requested-With',
        'x-custom-lang',
        'user-agent',
      ],
    },
    timeout: {
      in: process.env.MIDDLEWARE_TIMEOUT
        ? ms(process.env.MIDDLEWARE_TIMEOUT)
        : ms('60s'), // 60s based on ms module
    },
  }),
);
