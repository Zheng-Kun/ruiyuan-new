<template>
  <t-table
    v-model:display-columns="displayColumns"
    stripe
    resizable
    class="data-source-table"
    :data="data"
    :columns="columns"
    :column-controller="{
      // placement: 'top-right',
      fields: columns.filter((col) => col.colKey !== 'serial-number').map((col) => col.colKey),
      buttonProps: {
        theme: 'default',
        content: '',
        shape: 'circle',
        variant: 'base',
      }
    }"
    hover
    :loading="tableLoading"
    :pagination="pagination"
    bordered
    height="calc(100% - 64px)"
  ></t-table>
</template>
<script setup lang="ts">
import { RefSymbol } from '@vue/reactivity';
import { BaseTableCol, ButtonProps, DateRangePickerPanel, FilterValue, InputProps, TableProps } from 'tdesign-vue-next';

const props = defineProps<{
  id: number;
}>();

const pagination = reactive({
  defaultPageSize: 10,
  defaultCurrent: 1,
  // pageSize: 10,
  // total: ,
  total: 24,
});

const tableLoading = ref(false);

const data = ref<
  {
    [key: string]: any;
  }[]
>([
  { id: 1, name: 'Jane Doe', age: 30, email: 'janedoe@foxmail.com', date: '2025-10-01' },
  { id: 2, name: 'Jane Doe1', age: 312, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 3, name: 'Jane Doe2', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 4, name: 'Jane Doe3', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 5, name: 'Jane Doe4', age: 10, email: 'janedoe@foxmail.com', date: '2024-05-03' },
  { id: 6, name: 'Jane Doe5', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 7, name: 'Jane Doe6', age: 340, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 8, name: 'Jane Doe7', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 11, name: 'Jane Doe', age: 30, email: 'janedoe@foxmail.com', date: '2025-10-01' },
  { id: 21, name: 'Jane Doe', age: 30, email: 'janedoe@foxmail.com', date: '2025-10-01' },
  { id: 12, name: 'Jane Doe1', age: 312, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 22, name: 'Jane Doe1', age: 312, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 13, name: 'Jane Doe2', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 23, name: 'Jane Doe2', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 14, name: 'Jane Doe3', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 24, name: 'Jane Doe3', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 15, name: 'Jane Doe4', age: 10, email: 'janedoe@foxmail.com', date: '2024-05-03' },
  { id: 25, name: 'Jane Doe4', age: 10, email: 'janedoe@foxmail.com', date: '2024-05-03' },
  { id: 16, name: 'Jane Doe5', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 26, name: 'Jane Doe5', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 17, name: 'Jane Doe6', age: 340, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 27, name: 'Jane Doe6', age: 340, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 18, name: 'Jane Doe7', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
  { id: 28, name: 'Jane Doe7', age: 30, email: 'janedoe@foxmail.com', date: '2023-10-01' },
]);

const columns = ref<BaseTableCol[]>([
  { colKey: 'serial-number', title: '序号', width: 100, align: 'center'},
  { colKey: 'id', title: 'ID', width: 100, align: 'center' },
  { colKey: 'name', title: 'Name', width: 150, align: 'center' },
  { colKey: 'age', title: 'Age', width: 100, align: 'center' },
  { colKey: 'email', title: 'Email', width: 200, align: 'center' },
  { colKey: 'date', title: 'Date', width: 150, align: 'center' },
]);

const displayColumns = ref([]);

async function fetchTableData() {
  tableLoading.value = true;
  // 请求数据
  // 生成 columns 与 data
  // 处理 displayColumns
  // 处理pagination
  displayColumns.value = columns.value.map((col) => col.colKey);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟异步请求
  tableLoading.value = false;
}

onMounted(() => {
  fetchTableData();
});
watch(
  () => props.id,
  (val) => {
    // TODO setData
    fetchTableData();
  },
);
</script>

<style scoped lang="less">
.data-source-table {
  width: 100%;
  height: 100%;
  position: relative;
  :deep(.t-table__column-controller-trigger) {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 10000;
    .t-button {
      backdrop-filter: blur(5px);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
      &:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
