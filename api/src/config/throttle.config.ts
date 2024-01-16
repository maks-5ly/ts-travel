import { registerAs } from '@nestjs/config';

export default registerAs(
  'throttle',
  (): Record<string, any> => ({
    ttl: 60 * 30, // seconds

    rateLimit: {
      resetTime: '1', // secs
      maxRequestPerIp: 25, // max request per reset time
    },
  }),
);
