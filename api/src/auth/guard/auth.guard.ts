// import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
// import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
//
// import { isDefined } from 'class-validator';
// import compact from 'lodash/compact';
//
// import { isAclGuardConfig } from '../type-guard';
// import { EnrichUserLoginGuard } from './acl/enrich-user-login.guard';
// import { AuthLoginCredentialsGuard } from './login/auth-login-credentials.guard';
// import { AuthPayloadPasswordExpiredGuard } from './payload/auth.password-expired.guard';
// import { ReqUserAclRoleActiveGuard } from '@/access-control-list/role/guard';
// import {
//   AclAbilityGuard,
//   DemoUserRestrictionsGuard,
//   EnrichUserBaseGuard,
//   OrganizationCtxPutToRequestGuard,
//   ReqUserActiveGuard,
//   ReqUserSystemRoleOnlyGuard,
//   ReqUserVerifiedOnlyGuard,
//   UserAclRolePutToRequestGuard,
// } from '@/auth/guard/acl';
// import { AuthSubscriptionExpiredGuard } from '@/auth/guard/payload/auth.subscription-expired.guard';
// import {
//   AuthSurveyTokenGuard,
//   EnrichUserWithUserBindingsGuard,
// } from '@/auth/guard/survey';
// import { ReqUserOrganizationActiveGuard } from '@/organization/guard';
//
// import { IAclGuard, IAclGuardPublic } from '../type';
//
// import {
//   ACL_ABILITIES_META_KEY,
//   DEMO_USER_RESTRICTIONS_META_KEY,
//   EnumDemoUsersRestrictions,
//   SYSTEM_ROLE_ONLY_META_KEY,
//   USER_FOR_SURVEY_META_KEY,
//   USER_VERIFIED_ONLY_META_KEY,
// } from '../constant';
//
// import { JwtGuard } from './jwt';
// import { JwtOptionalGuard } from './jwt-optional';
// import { JwtRefreshGuard } from './jwt-refresh';
//
// export function AclGuardPublic(
//   config: IAclGuardPublic = { enrichUser: false },
// ) {
//   const { enrichUser } = config;
//   return applyDecorators(
//     ...compact([
//       UseGuards(
//         ...compact([JwtOptionalGuard, enrichUser ? EnrichUserBaseGuard : null]),
//       ),
//     ]),
//   );
// }
//
import { IAuthGuard } from '@/auth/type';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import compact from 'lodash/compact';
import { JwtGuard } from '@/auth/guard/jwt';
import { isDefined } from 'class-validator';
import { SYSTEM_ROLE_ONLY_META_KEY } from '@/auth/constant';
import { AuthLoginCredentialsGuard } from '@/auth/guard/login/auth-login-credentials.guard';

export function AuthGuard(config: IAuthGuard) {
  const { systemOnly } = config;
  return applyDecorators(
    ...compact([
      UseGuards(
        ...compact([
          JwtGuard,
          // systemOnly ? ReqUserSystemRoleOnlyGuard : null,
        ]),
      ),
      isDefined(systemOnly)
        ? SetMetadata(SYSTEM_ROLE_ONLY_META_KEY, systemOnly)
        : null,
    ]),
  );
}

export function LoginGuard() {
  return applyDecorators(UseGuards(AuthLoginCredentialsGuard));
}
