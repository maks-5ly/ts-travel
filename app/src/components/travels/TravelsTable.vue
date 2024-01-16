<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'

type Props = {
  // todo: generate types from gql schema
  travels: any[]
  onDelete: (id: string) => Promise<void>
  onAdd: () => Promise<void>
}

import { Button, Table, Popconfirm } from 'ant-design-vue'
import { ref, h, watch } from 'vue'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

const { travels, onDelete, onAdd } = defineProps<Props>()

const { user, isAdmin } = useAuth()

const columns = ref([
  {
    title: 'Travel Name',
    dataIndex: 'name',
    width: '30%'
  },
  {
    title: 'Travel Description',
    dataIndex: 'description'
  },
  {
    title: 'Duration (days/ nights)',
    dataIndex: 'duration'
  }
])

watch(
  () => user.value,
  () => {
    if (isAdmin.value) {
      columns.value.push({
        title: 'Operation',
        dataIndex: 'operation'
      })
    } else {
      columns.value = columns.value.filter((column) => column.dataIndex !== 'operation')
    }
  }
)

const handleDelete = (key: string) => {
  onDelete && onDelete(key)
}

const handleAdd = () => {
  onAdd()
}
</script>

<template>
  <Button
    v-if="isAdmin?.value"
    class="editable-add-btn"
    style="margin-bottom: 8px"
    @click="handleAdd"
    >Add</Button
  >
  <Table bordered :data-source="travels" :columns="columns">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ text }}
          </div>
        </div>
      </template>
      <!--  todo: show only for admin/editor    -->
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="operations-cell">
          <Popconfirm
            :v-if="isAdmin?.value"
            title="Sure to delete?"
            @confirm="handleDelete(record.id)"
          >
            <Button :icon="h(DeleteOutlined)" />
          </Popconfirm>
          <RouterLink :v-if="isAdmin?.value" :to="`/travel/${record.id}`">
            <Button :icon="h(EditOutlined)" />
          </RouterLink>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'duration'">
        {{ record.numberOfDays }} / {{ record.numberOfNights }}
      </template>
    </template>
  </Table>
</template>

<style scoped>
.editable-cell {
  & .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.operations-cell {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
