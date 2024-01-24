<script setup lang="ts">
import { useQuery, useMutation } from '@vue/apollo-composable'
import { TRAVELS_QUERY } from '@/graphql/queries'
import { DELETE_TRAVEL_MUTATION } from '@/graphql/mutations'
import { ref, watch } from 'vue'
import TravelsTable from '@/components/travels/TravelsTable.vue'
import { message } from 'ant-design-vue'

const skip = ref(0)
const take = ref(10)

const { loading, result, refetch } = useQuery(TRAVELS_QUERY, {
  skip,
  take
})

const { mutate: deleteTravel, error } = useMutation(DELETE_TRAVEL_MUTATION)

const onDelete = async (id) => {
  try {
    await deleteTravel({
      id
    })
    refetch({
      skip,
      take
    })
  } catch {}
}

const onAdd = () => {
  refetch({
    skip,
    take
  })
}

watch(
  () => error.value,
  () => {
    if (error.value) {
      message.error(error.value?.message)
    }
  }
)
</script>

<template>
  <p>Travels</p>
  <div v-if="loading">Loading</div>
  <pre v-else>
    <TravelsTable :travels="result?.travels?.data || []" :on-delete="onDelete" :on-add="onAdd"/>
  </pre>
</template>
