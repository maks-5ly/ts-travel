import { Module } from '@nestjs/common';
import { TypeormDbService } from '@/db/service';

@Module({
  providers: [TypeormDbService],
  exports: [TypeormDbService],
})
export class DbModule {}
