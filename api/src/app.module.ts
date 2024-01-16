import { Module } from '@nestjs/common';
import { RouterModule } from './router/router.module';
import { CommonModule } from './common/common.module';
import { ResponseModule } from '@/utils/response/response.module';
import { RolesModule } from './roles/roles.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareModule } from '@/utils/middleware/middleware.module';

@Module({
  imports: [
    RouterModule,
    CommonModule,
    ResponseModule,
    RolesModule,
    PaginationModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ttl: configService.get<number>('throttle.rateLimit.resetTime'),
          limit: configService.get<number>(
            'throttle.rateLimit.maxRequestPerIp',
          ),
          ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /kube-probe/gi],
          // TODO: save in redis
          storage: null,
          throttlers: [
            {
              name: 'short',
              ttl: 1000,
              limit: 3,
            },
            {
              name: 'medium',
              ttl: 10000,
              limit: 20,
            },
            {
              name: 'long',
              ttl: 60000,
              limit: 100,
            },
          ],
        };
      },
    }),
    MiddlewareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
