import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTimeoutInterceptor } from '@/utils/response/interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeoutInterceptor,
    },
  ],
})
export class ResponseModule {}
