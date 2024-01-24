import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  HelperEncryptionService,
  HelperHashService,
} from '@/utils/helper/service';

import { IAuthPassword } from '../type';
import { AuthUserJwtPayloadSerialization } from '@/auth/serialization';
import { plainToInstance } from 'class-transformer';
import { User } from '@/user/entities';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretToken: string =
    this.configService.get<string>('auth.jwt.accessToken.secretKey');
  private readonly accessTokenExpirationTime: string =
    this.configService.get<string>('auth.jwt.accessToken.expirationTime');
  private readonly accessTokenNotBeforeExpirationTime: string =
    this.configService.get<string>(
      'auth.jwt.accessToken.notBeforeExpirationTime',
    );

  constructor(
    private readonly helperHashService: HelperHashService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessTokenForUser(user: User): Promise<string> {
    return this.createAccessToken({
      ...this.serializationJwtPayload(user),
    });
  }

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.accessTokenSecretToken,
      expiredIn: this.accessTokenExpirationTime,
      notBefore: this.accessTokenNotBeforeExpirationTime,
    });
  }

  async validateAccessToken(token: string): Promise<boolean> {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.accessTokenSecretToken,
    });
  }

  async payloadAccessToken(token: string): Promise<Record<string, any>> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  async validateUserPassword(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.helperHashService.bcryptCompare(passwordString, passwordHash);
  }

  serializationJwtPayload(
    data: Partial<User>,
  ): AuthUserJwtPayloadSerialization {
    return plainToInstance(AuthUserJwtPayloadSerialization, data);
  }

  async createPassword(password: string): Promise<IAuthPassword> {
    const saltLength: number = this.configService.get<number>(
      'auth.password.saltLength',
    );

    const salt: string = this.helperHashService.randomSalt(saltLength);

    const passwordHash = this.helperHashService.bcrypt(password, salt);

    return {
      passwordHash,
      salt,
    };
  }
}
