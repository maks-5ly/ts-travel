export enum RoleEnum {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR'
}

export type Role = {
  id: string
  name: RoleEnum
}

export type User = {
  id: string
  email: string
  roles: Role[]
}

export type Nullable<T> = T | null
