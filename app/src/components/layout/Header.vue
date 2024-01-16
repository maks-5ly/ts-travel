<script setup lang="ts">
import { h } from 'vue'
import { LayoutHeader, Button } from 'ant-design-vue'
import { useAuth } from '@/composables/useAuth'
import { LogoutOutlined } from '@ant-design/icons-vue'
import LoginModal from '@/components/login/LoginModal.vue'

const { user, logout } = useAuth()
</script>

<template>
  <LayoutHeader class="header" theme="light">
    <LoginModal v-if="!user" />
    <Button v-else type="primary" :icon="h(LogoutOutlined)" :onclick="logout">{{
      user?.value?.email
    }}</Button>
  </LayoutHeader>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
</style>
