import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import {
  HelperDateService,
  HelperEncryptionService,
  HelperHashService,
  HelperStringService,
} from '@/utils/helper/service';
import {
  IsDateAfterConstraint,
  IsPasswordStrongConstraint,
} from '@/utils/helper/validators';

@Global()
@Module({
  providers: [
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    IsPasswordStrongConstraint,
    HelperStringService,
    IsDateAfterConstraint,
  ],
  exports: [
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    HelperStringService,
    IsPasswordStrongConstraint,
  ],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('helper.jwt.defaultSecretKey'),
          signOptions: {
            expiresIn: configService.get<string>(
              'helper.jwt.defaultExpirationTime',
            ),
          },
        };
      },
    }),
  ],
})
export class HelperModule {}
