export interface IAuthPassword {
  salt: string;
  passwordHash: string;
}

export interface IAuthGuard {
  systemOnly?: boolean;
}
