<script setup lang="ts">
import { Table, Space, Tag } from 'ant-design-vue'

type Props = {
  // todo: generate types from gql schema
  users: any[]
}
const { users } = defineProps<Props>()

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    width: '30%'
  },
  {
    title: 'Roles',
    dataIndex: 'roles'
  },
]

const rolesToColorMap = {
  ADMIN: 'red',
  USER: 'blue'
}
</script>

<template>
<!-- @todo: move Table to a separate component -->
  <Table bordered :data-source="users" :columns="columns">
    <template #bodyCell="{ column, text: roles }">
      <template v-if="column.dataIndex === 'roles'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            <Space size={[0, 8]} wrap>
            </Space>
            <Tag
              v-for="role in roles"
              :key="role.id"
              :color="rolesToColorMap[role.name]"
            >
              {{ role.name }}
            </Tag>
          </div>
        </div>
      </template>
    </template>
  </Table>
</template>

<style scoped>

</style>
