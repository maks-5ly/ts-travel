import { Module } from '@nestjs/common';
import { SystemSeedService } from '@/commands/service/seeds';
import { CommonModule } from '@/common/common.module';
import { UserModule } from '@/user/user.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';

@Module({
  imports: [CommonModule, UserModule, PaginationModule],
  providers: [SystemSeedService],
  exports: [SystemSeedService],
})
export class CommandsModule {}
