import type { User } from '@/types'

export enum StorageKeys {
  AUTH = 'AUTH',
  USER = 'USER'
}

export class LocalstorageService {
  static getAuthToken() {
    return localStorage.getItem(StorageKeys.AUTH)
  }

  static setAuthToken(token: string) {
    return localStorage.setItem(StorageKeys.AUTH, token)
  }

  static setUser(user: User) {
    return localStorage.setItem(StorageKeys.USER, JSON.stringify(user))
  }

  static getUser(): User | null {
    const user = localStorage.getItem(StorageKeys.USER)

    return user ? JSON.parse(user) : null
  }

  static clearUser() {
    return localStorage.removeItem(StorageKeys.USER)
  }

  static clearAuthToken() {
    return localStorage.removeItem(StorageKeys.AUTH)
  }
}
