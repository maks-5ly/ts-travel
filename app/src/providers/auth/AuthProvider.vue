<script setup lang="ts">
import { computed, onBeforeMount, provide, ref } from 'vue'
import { AUTH_PROVIDER_KEY } from '@/constants'
import { useApolloClient, useMutation } from '@vue/apollo-composable'
import { LOGIN_MUTATION } from '@/graphql/mutations'
import { LocalstorageService } from '@/service/localstorage'
import { RoleEnum } from '@/types'
import { useRouter } from 'vue-router'

const { resolveClient } = useApolloClient()
const router = useRouter();

const user = ref(null)

const { mutate: login, loading } = useMutation(LOGIN_MUTATION, {
  update(_, { data }) {
    if (data.login?.accessToken) {
      LocalstorageService.setAuthToken(data.login?.accessToken)
    }
    if (data?.login?.user) {
      user.value = data?.login?.user
      LocalstorageService.setUser(data?.login?.user)
    }
  }
})

const isAdmin = computed(() => {
  return user?.value?.roles?.some((role) => role.name === RoleEnum.ADMIN)
})

const isEditor = computed(() => {
  return isAdmin.value || user?.value?.roles.some((role) => role.name === RoleEnum.EDITOR)
})

const logout = async () => {
  try {
    LocalstorageService.clearUser()
    LocalstorageService.clearAuthToken()
    user.value = null
    await router.push({ name: 'home' })

  } catch (e) {
    console.log('!_ERROR)_!', e)
  }
}

provide(AUTH_PROVIDER_KEY, {
  login,
  user,
  isAdmin,
  isEditor,
  logout,
  isAuthLoading: loading
})

onBeforeMount(() => {
  user.value = LocalstorageService.getUser()
})
</script>

<template>
  <slot />
</template>

<style scoped></style>
