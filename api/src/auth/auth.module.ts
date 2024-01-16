import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/service';
import { JwtStrategy } from '@/auth/guard/jwt';
import { JwtRefreshStrategy } from '@/auth/guard/jwt-refresh';
import { AuthResolver } from '@/auth/resolvers/auth.resolver';

@Module({
  exports: [JwtStrategy, JwtRefreshStrategy, AuthService],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AuthResolver],
})
export class AuthModule {}
