import { Module } from '@nestjs/common';
import { UserService } from '@/user/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UserResolver } from '@/user/resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule, AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
