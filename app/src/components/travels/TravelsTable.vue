<script lang="ts" setup>
import { Button, Table, Popconfirm } from 'ant-design-vue'
import { ref, h } from 'vue'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

const props = defineProps(['travels'])

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
  },
  // TODO: render button if user has admin/editor persmissions
  {
    title: 'Operation',
    dataIndex: 'operation'
  }
])

const edit = (key: string) => {
  console.log('!_EDIT_!', key)
}

const onDelete = (key: string) => {
  console.log('!_DELETE_!', key)
}

const handleAdd = () => {}
</script>

<template>
  <!--TODO: render button if user has admin/editor persmissions -->
  <Button v-if="true" class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd"
    >Add</Button
  >
  <Table bordered :data-source="props.travels" :columns="columns">
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
          <Popconfirm v-if="true" title="Sure to delete?" @confirm="onDelete(record.key)">
            <Button :icon="h(DeleteOutlined)" />
          </Popconfirm>
          <RouterLink :to="`/travel/${record.id}`">
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
