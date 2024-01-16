import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { MutateFunction } from '@vue/apollo-composable'
import type { User } from '@/types'

export type AuthStore = InjectionKey<{
  login: MutateFunction<any, { email: string; password: string }>
  user: Ref<User>
  isAdmin: ComputedRef<boolean>
  isEditor: ComputedRef<boolean>
  logout: () => Promise<void>
  isAuthLoading: Ref<boolean>
}>

export const AUTH_PROVIDER_KEY = Symbol() as AuthStore
