import { IAuthGuard } from '@/auth/type';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import compact from 'lodash/compact';
import { JwtGuard } from '@/auth/guard/jwt';
import { isDefined } from 'class-validator';
import { AUTH_ROLE_META_KEY } from '@/auth/constant';
import { AuthLoginCredentialsGuard } from '@/auth/guard/login/auth-login-credentials.guard';
import { UserAclGuard } from '@/auth/guard/user-acl.guard';
import { JwtOptionalGuard } from '@/auth/guard/jwt-optional';
import { UserEnrichGuard } from '@/auth/guard/user-enrich.guard';

export function AuthGuard(config: IAuthGuard) {
  const { role } = config;
  return applyDecorators(
    ...compact([
      UseGuards(
        ...compact([JwtGuard, UserEnrichGuard, role ? UserAclGuard : null]),
      ),
      isDefined(role) ? SetMetadata(AUTH_ROLE_META_KEY, role) : null,
    ]),
  );
}

export function AuthOptionalGuard() {
  return applyDecorators(UseGuards(JwtOptionalGuard, UserEnrichGuard));
}

export function LoginGuard() {
  return applyDecorators(UseGuards(AuthLoginCredentialsGuard));
}
