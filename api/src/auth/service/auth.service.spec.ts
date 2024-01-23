import { AuthService } from '@/auth/service/auth.service';
import {
  HelperEncryptionService,
  HelperHashService,
} from '@/utils/helper/service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { serviceMockFactory } from '../../../test/factories';
import { MockType } from '../../../test/types';

describe.skip('AuthService', () => {
  let service: AuthService;
  let helperHashService: MockType<HelperHashService>;
  let helperEncryptionService: MockType<HelperEncryptionService>;
  let configService: MockType<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HelperHashService,
          useFactory: serviceMockFactory<HelperHashService>(),
        },
        {
          provide: HelperEncryptionService,
          useFactory: serviceMockFactory<HelperEncryptionService>(),
        },
        {
          provide: ConfigService,
          useFactory: serviceMockFactory<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    helperHashService =
      module.get<MockType<HelperHashService>>(HelperHashService);
    helperEncryptionService = module.get<MockType<HelperEncryptionService>>(
      HelperEncryptionService,
    );
    configService = module.get<MockType<ConfigService>>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates access token correctly', async () => {
    const payload = { key: 'value' };
    const jwtOptions = {
      secretKey: 'secret',
      expiredIn: '1h',
      notBefore: '10m',
    };

    helperEncryptionService.jwtEncrypt.mockImplementation(() =>
      Promise.resolve('token'),
    );

    const result = await service.createAccessToken(payload);

    expect(result).toEqual('token');
    expect(helperEncryptionService.jwtEncrypt).toHaveBeenCalledWith(
      payload,
      jwtOptions,
    );
  });

  it('validates access token correctly', async () => {
    const token = 'token';

    helperEncryptionService.jwtVerify.mockImplementation(() =>
      Promise.resolve(true),
    );

    const result = await service.validateAccessToken(token);

    expect(result).toEqual(true);
    expect(helperEncryptionService.jwtVerify).toHaveBeenCalledWith(token, {
      secretKey: 'secret',
    });
  });

  it('decrypts access token correctly', async () => {
    const token = 'token';
    const payload = { key: 'value' };

    helperEncryptionService.jwtDecrypt.mockImplementation(() =>
      Promise.resolve(payload),
    );

    const result = await service.payloadAccessToken(token);

    expect(result).toEqual(payload);
    expect(helperEncryptionService.jwtDecrypt).toHaveBeenCalledWith(token);
  });

  it('validates user password correctly', async () => {
    const passwordString = 'password';
    const passwordHash = 'hash';

    helperHashService.bcryptCompare.mockImplementation(() =>
      Promise.resolve(true),
    );

    const result = await service.validateUserPassword(
      passwordString,
      passwordHash,
    );

    expect(result).toEqual(true);
    expect(helperHashService.bcryptCompare).toHaveBeenCalledWith(
      passwordString,
      passwordHash,
    );
  });

  it('creates password correctly', async () => {
    const password = 'password';
    const salt = 'salt';
    const passwordHash = 'hash';

    configService.get.mockReturnValue(10);
    helperHashService.randomSalt.mockReturnValue(salt);
    helperHashService.bcrypt.mockReturnValue(passwordHash);

    const result = await service.createPassword(password);

    expect(result).toEqual({ passwordHash, salt });
    expect(helperHashService.randomSalt).toHaveBeenCalledWith(10);
    expect(helperHashService.bcrypt).toHaveBeenCalledWith(password, salt);
  });
});
