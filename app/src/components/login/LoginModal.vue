<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Button, Modal } from 'ant-design-vue'
import LoginForm from '@/components/login/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const open = ref<boolean>(false)
const { isAuthLoading, login } = useAuth()
const showModal = () => {
  open.value = true
}

const form = reactive({
  email: '',
  password: ''
})

const handleOk = () => {
  login(form)
}
</script>

<template>
  <div>
    <Button type="primary" @click="showModal">Login</Button>
    <Modal v-model:open="open" title="Title" :confirm-loading="isAuthLoading" @ok="handleOk">
      <LoginForm :form="form" />
    </Modal>
  </div>
</template>
