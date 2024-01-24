<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { USERS_QUERY } from '@/graphql/queries'
import UsersTable from '@/components/users/UsersTable.vue'
import { message, Spin } from 'ant-design-vue'


const { result, loading, onError} = useQuery(USERS_QUERY)

onError((error) => {
  message.error(error.message)
})
</script>

<template>

  <div class="loader" v-if="loading"><Spin size="large"/></div>
  <UsersTable :users="result?.users || []" />
</template>

<style scoped>
 .loader {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
 }
</style>
