import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      jsonWebTokenOptions: {
        ignoreNotBefore: true,
      },
      secretOrKey: configService.get<string>('auth.jwt.refreshToken.secretKey'),
    });
  }

  async validate(payload: Record<string, any>): Promise<Record<string, any>> {
    return payload;
  }
}
