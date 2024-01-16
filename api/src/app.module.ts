import { Module } from '@nestjs/common';
import { RouterModule } from './router/router.module';
import { CommonModule } from './common/common.module';
import { ResponseModule } from '@/utils/response/response.module';
import { RolesModule } from './roles/roles.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';

@Module({
  imports: [
    RouterModule,
    CommonModule,
    ResponseModule,
    RolesModule,
    PaginationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
