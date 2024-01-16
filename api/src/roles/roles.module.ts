import { Module } from '@nestjs/common';
import { RolesService } from '@/roles/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/roles/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
