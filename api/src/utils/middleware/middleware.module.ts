import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CorsMiddleware } from './cors/cors.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorsMiddleware, HelmetMiddleware).forRoutes('*');
  }
}
