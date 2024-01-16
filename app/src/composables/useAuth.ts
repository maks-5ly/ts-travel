import { inject } from 'vue'
import { AUTH_PROVIDER_KEY, type AuthStore } from '@/constants'

export function useAuth(): AuthStore {
  const store = inject<AuthStore>(AUTH_PROVIDER_KEY)

  if (!store) {
    throw new Error('Auth store has not been instantiated')
  }

  return store
}
