import { Module } from '@nestjs/common';
import { SystemSeedService } from '@/commands/service/seeds';
import { CommonModule } from '@/common/common.module';
import { UserModule } from '@/user/user.module';
import { PaginationModule } from '@/utils/pagination/pagination.module';
import { CreateDbSeed } from '@/commands/service/seeds/create-db.seed';

@Module({
  imports: [CommonModule, UserModule, PaginationModule],
  providers: [SystemSeedService, CreateDbSeed],
  exports: [SystemSeedService],
})
export class CommandsModule {}
