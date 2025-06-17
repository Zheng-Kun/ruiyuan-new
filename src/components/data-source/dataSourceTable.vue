<template>
  <t-table
    v-model:display-columns="displayColumns"
    stripe
    row-key="index"
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
      },
    }"
    hover
    :loading="tableLoading"
    :pagination="pagination"
    bordered
    height="calc(100% - 64px)"
  >
    <template v-for="item in columns.filter((col) => col.colKey !== 'serial-number')" #[item.title] :key="item.colKey">
      <t-tooltip v-if="props.enableHeaderClick" placement="top" :content="`双击引用列名: ${item.colKey}`">
        <div class="clickable-title header-title" @dblclick="handleTitleDblClick(item)">{{ item.colKey }}</div>
      </t-tooltip>
      <div v-else class="header-title">{{ item.colKey }}</div>
    </template>
  </t-table>
</template>
<script setup lang="ts">
import { BaseTableCol, MessagePlugin } from 'tdesign-vue-next';

import dataSourceApi from '@/api/dataSource';

const props = defineProps<{
  id: string;
  enableHeaderClick?: boolean; // 是否启用列标题双击事件
}>();

const pagination = reactive({
  defaultPageSize: 10,
  defaultCurrent: 1,
  total: 0,
});

const tableLoading = ref(false);

const emit = defineEmits<{
  (e: 'tableHeaderClick', value: any): void;
}>();

const data = ref<
  {
    [key: string]: any;
  }[]
>([]);

const columns = ref<any[]>([{ colKey: 'serial-number', title: '序号', width: 100, align: 'center' }]);

const displayColumns: Ref<string[]> = ref([]);

async function fetchTableData() {
  console.log('Fetching table data for ID:', props.id);
  if (!props.id) return;

  tableLoading.value = true;
  try {
    const response = await dataSourceApi.getTableData(props.id);

    // 处理表格数据
    if (response.data && response.data.records) {
      data.value = response.data.records;
      pagination.total = response.data.total || 0;
    }

    // 动态生成列配置
    if (response.columns && response.columns.length > 0) {
      columns.value = [
        { colKey: 'serial-number', title: '序号', width: 100, align: 'center' },
        ...response.columns.map((col: any) => ({
          colKey: col.columnName,
          title: `title-${col.columnName}`,
          width: getColumnWidth(col.dataType),
          align: 'center',
          ellipsis: true,
          // 可以根据数据类型设置不同的渲染方式
          ...(col.dataType && getColumnConfig(col.dataType)),
        })),
      ];
    }
    // 设置显示的列
    displayColumns.value = columns.value.map((col) => col.colKey as string);
  } catch (error) {
    console.error('获取表格数据失败:', error);
    data.value = [];
    pagination.total = 0;
    columns.value = [{ colKey: 'serial-number', title: '序号', width: 100, align: 'center' }];
    displayColumns.value = ['serial-number'];
  } finally {
    tableLoading.value = false;
  }
}

// 根据数据类型设置列宽
function getColumnWidth(dataType: string): number {
  const typeWidthMap: { [key: string]: number } = {
    string: 150,
    long: 120,
    integer: 100,
    double: 120,
    float: 120,
    bigdecimal: 130,
    localdatetime: 180,
    localdate: 120,
    localtime: 100,
    boolean: 80,
    'byte[]': 100,
    biginteger: 140,
  };

  const normalizedType = dataType?.toLowerCase() || '';
  for (const [type, width] of Object.entries(typeWidthMap)) {
    if (normalizedType.includes(type)) {
      return width;
    }
  }
  return 150; // 默认宽度
}

// 根据数据类型设置列配置
function getColumnConfig(dataType: string) {
  const normalizedType = dataType?.toLowerCase() || '';

  // 数字类型右对齐
  if (
    ['long', 'integer', 'double', 'float', 'bigdecimal', 'biginteger'].some((type) => normalizedType.includes(type))
  ) {
    return { align: 'right' };
  }

  // 布尔类型居中
  if (normalizedType.includes('boolean')) {
    return { align: 'center' };
  }

  // 时间类型居中
  if (
    normalizedType.includes('localdatetime') ||
    normalizedType.includes('localdate') ||
    normalizedType.includes('localtime')
  ) {
    return { align: 'center' };
  }

  // 其他默认左对齐
  return { align: 'left' };
}

function handleTitleDblClick(col: BaseTableCol) {
  console.log('双击列标题:', col);
  // 可以在这里添加双击列标题的逻辑
  MessagePlugin.success(`双击列标题: ${col.title}`);
  emit('tableHeaderClick', col);
}

onMounted(() => {
  fetchTableData();
});

watch(
  () => props.id,
  () => {
    fetchTableData();
  },
);
</script>

<style scoped lang="less">
.data-source-table {
  width: 100%;
  height: 100%;
  position: relative;
  .clickable-title {
    cursor: pointer;
    // color: var(--td-text-color-secondary);
    // border-radius: 4px;
    &:hover {
      // color: var(--td-text-color-primary);
      // border: solid 1px var(--td-text-color-placeholder);
      background-color: var(--td-bg-color-secondarycontainer-hover);
    }
  }
  :deep(.t-table__header th) {
    padding: 0;
    .header-title {
      padding: 10px;
    }
  }
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
