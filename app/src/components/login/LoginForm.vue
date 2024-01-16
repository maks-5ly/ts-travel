<script lang="ts" setup>
import { reactive } from 'vue'
import { Form, FormItem, Input, InputPassword } from 'ant-design-vue'

interface FormState {
  form: {
    email: string
    password: string
  }
}

const { form } = defineProps<FormState>()
</script>

<template>
  <Form
    :model="form"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
  >
    <FormItem
      label="Email"
      name="email"
      :rules="[{ required: true, message: 'Please input your email!' }]"
    >
      <Input v-model:value="form.email" />
    </FormItem>

    <FormItem
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <InputPassword v-model:value="form.password" />
    </FormItem>
  </Form>
</template>
