<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthProvider from '@/providers/auth/AuthProvider.vue'
</script>

<template>
  <AuthProvider>
    <AppLayout>
      <RouterView />
    </AppLayout>
  </AuthProvider>
</template>

<style scoped></style>
