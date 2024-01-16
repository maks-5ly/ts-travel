<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { TRAVELS_QUERY } from '@/graphql/queries'
import { onMounted, ref } from 'vue'
import TravelsTable from '@/components/travels/TravelsTable.vue'

const skip = ref(0)
const take = ref(10)

const { loading, result } = useQuery(TRAVELS_QUERY, {
  skip,
  take
})
</script>

<template>
  <p>Travels</p>
  <div v-if="loading">Loading</div>
  <pre v-else>
    <TravelsTable :travels="result.travels.data"/>
  </pre>
</template>
