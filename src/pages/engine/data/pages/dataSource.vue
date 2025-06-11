<template>
  <div class="data-source-container">
    {{ dataSourcePreviewVisible }}
    <filterCardList
      :fetch-list="fetchList"
      :page-size="10"
      :enable-click="true"
      :can-select="false"
      :filter-form="filterForm"
      :info-config="infoConfig"
      :operates="operates"
      @card-click="handleCardClick"
      @operate-click="handleOperateClick"
    >
      <template #filters>
        <div class="filter-from">
          <t-input v-model="filterForm.tableName" placeholder="请输入名称" label="名称" clearable></t-input>
          <t-select
            v-model="filterForm.spaceId"
            :options="spaceOptions"
            label="数据空间"
            clearable
            filterable
          ></t-select>
        </div>
      </template>
    </filterCardList>
    <dataSourceDetailPreviewDrawer :id="dataSourcePreviewId" v-model:visible="dataSourcePreviewVisible" />
  </div>
</template>
<script setup lang="ts">
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';

import dataSourceApi from '@/api/dataSource';
import filterCardList from '@/components/card-list/filterCardList.vue';
import { FilterData } from '@/components/card-list/types';
import dataSourceDetailPreviewDrawer from '@/components/data-source/dataSourceDetailPreviewDrawer.vue';

const filterForm = reactive({
  tableName: '',
  spaceId: '',
});

const dataSourcePreviewVisible = ref(false);
const dataSourcePreviewId = ref('');

const spaceOptions = ref([
  { label: '数据空间1', value: '1' },
  { label: '数据空间2', value: '2' },
  { label: '数据空间3', value: '3' },
]);

const infoConfig = ref([
  { label: '数据空间', key: 'space' },
  {
    label: 'Nickname',
    key: 'tableRemarkName',
  },
]);

async function fetchList(filterData: FilterData) {
  return dataSourceApi.getList(filterData).then((data) => {
    return {
      ...data,
      list: data.records.map((item: any) => ({
        ...item,
        title: item.tableName,
        // desc: item.tableDesc || '暂无描述',
        id: item.tableId,
        space: '数据空间',
        tags: ['ceshi', '测试', '测试数据源'],
      })),
    };
  });
}

function handleCardClick() {
  // const a = 'sdf';
}

const operates = ref([
  { name: '编辑', key: 'edit' },
  { name: '查看元数据', key: 'viewMetadata' },
  { name: '删除', key: 'delete' },
]);
function handleOperateClick(value: string, id: string) {
  switch (value) {
    case 'edit':
      console.log(`编辑数据源 ID: ${id}`);
      break;
    case 'delete':
      console.log(`删除数据源 ID: ${id}`);
      handleDelete(id);
      break;
    case 'viewMetadata':
      console.log(`查看元数据 ID: ${id}`);
      dataSourcePreviewId.value = id;
      dataSourcePreviewVisible.value = true;
      break;
    default:
      console.warn(`未知操作: ${value}`);
  }
}

function handleDelete(id: string) {
  const deleteConfirm = DialogPlugin.confirm({
    header: '删除数据源',
    theme: 'warning',
    body: '确定要删除此数据源吗？',
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    cancelBtn: {
      content: '取消',
    },
    dialogClassName: 'delete-dialog-confirm',
    onConfirm: async () => {
      await dataSourceApi.deleteItem(id).catch((error) => {
        console.error('删除数据源失败:', error);
      });
      MessagePlugin.success('数据源已删除');
      deleteConfirm.hide();
    },
    onCancel: () => {
      deleteConfirm.hide();
    },
  });
}
</script>

<style scoped lang="less">
.data-source-container {
  // height: 2000px;
  height: 100%;
  .filter-from {
    display: flex;
    gap: var(--td-size-4);
    justify-content: flex-start;
  }
}
</style>
