import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      jsonWebTokenOptions: {
        ignoreNotBefore: true,
      },
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secretKey'),
    });
  }

  async validate(payload: Record<string, any>): Promise<Record<string, any>> {
    return payload;
  }
}
