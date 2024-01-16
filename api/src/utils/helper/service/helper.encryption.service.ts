import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IHelperJwtOptions, IHelperJwtVerifyOptions } from '@/utils/helper';

@Injectable()
export class HelperEncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore || 0,
    });
  }

  jwtDecrypt(token: string): Record<string, any> {
    return this.jwtService.decode(token) as Record<string, any>;
  }

  jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean {
    try {
      this.jwtService.verify(token, {
        secret: options.secretKey,
      });
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
