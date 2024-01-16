import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HelperHashService {
  constructor(private readonly configService: ConfigService) {}

  randomSalt(length?: number): string {
    return genSaltSync(
      length || this.configService.get<number>('helper.salt.length'),
    );
  }

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  }

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  }

  async uuidV4(): Promise<string> {
    return uuidv4();
  }
}
