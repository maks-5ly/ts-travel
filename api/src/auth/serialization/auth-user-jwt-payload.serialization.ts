import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUserJwtPayloadSerialization {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly email!: string;
}
