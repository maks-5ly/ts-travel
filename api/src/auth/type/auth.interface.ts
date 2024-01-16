import { RoleEnum } from '@/roles/type';

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
}

export interface IAuthGuard {
  role?: RoleEnum;
}
