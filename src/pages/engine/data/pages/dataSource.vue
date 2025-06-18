<template>
  <div class="data-source-container">
    <filterCardList
      :fetch-list="fetchList"
      :page-size="10"
      :enable-click="true"
      :can-select="false"
      :filter-form="filterForm"
      :info-config="infoConfig"
      :operates="operates"
      @card-click="showPreviewDrawer"
      @operate-click="handleOperateClick"
    >
      <template #filters>
        <div class="filter-form">
          <t-button theme="primary" variant="outline" class="create-btn" @click="handleCreateDataSource">
            <template #icon>
              <t-icon name="add" />
            </template>
            新建数据源
          </t-button>
          <t-input v-model="filterForm.tableName" placeholder="请输入名称" label="名称" clearable></t-input>
          <t-select
            v-model="filterForm.spaceId"
            :options="spaceOptions"
            label="数据空间"
            clearable
            filterable
          ></t-select>
          <t-select v-model="filterForm.tag" :options="tagOptions" label="标签" clearable filterable></t-select>
        </div>
      </template>
      <!-- 新增 card-title-status 插槽 -->
      <template #card-title-status="{ item }">
        <div class="card-title-status">
          <span class="ds-status status-tag" :class="item.status === 'enabled' ? 'enabled' : 'disabled'">
            <component :is="item.status === 'enabled' ? OnStatusIcon : OffStatusIcon" class="status-icon" />
            {{ item.status === 'enabled' ? '启用' : '禁用' }}
          </span>
          <span class="ds-category status-tag" :class="item.category === 'online' ? 'online' : 'local'">
            <component :is="item.category === 'online' ? OnlineDataIcon : LocalDataIcon" class="status-icon" />
            {{ item.category === 'online' ? '在线数据' : '本地数据' }}
          </span>
        </div>
      </template>
    </filterCardList>
    <dataSourceDetailPreviewDrawer :id="dataSourcePreviewId" v-model:visible="dataSourcePreviewVisible" />
  </div>
</template>
<script setup lang="ts">
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';

import dataSourceApi from '@/api/dataSource';
import OnStatusIcon from '@/assets/datasource/MdiAccessPointCheck.svg?component';
import OffStatusIcon from '@/assets/datasource/MdiAccessPointOff.svg?component';
import OnlineDataIcon from '@/assets/datasource/MdiDatabase.svg?component';
import LocalDataIcon from '@/assets/datasource/MdiFileExcel.svg?component';
import filterCardList from '@/components/card-list/filterCardList.vue';
import { FilterData } from '@/components/card-list/types';
import dataSourceDetailPreviewDrawer from '@/components/data-source/dataSourceDetailPreviewDrawer.vue';

const filterForm = reactive({
  tableName: '',
  spaceId: '',
  tag: '',
});

const dataSourcePreviewVisible = ref(false);
const dataSourcePreviewId = ref('');

const spaceOptions = ref([
  { label: '数据空间1', value: '1' },
  { label: '数据空间2', value: '2' },
  { label: '数据空间3', value: '3' },
]);

const tagOptions = ref([
  { label: '标签1', value: 'tag1' },
  { label: '标签2', value: 'tag2' },
  { label: '标签3', value: 'tag3' },
]);

const infoConfig = ref([
  { label: '数据空间', key: 'space' },
  /* {
    label: 'Nickname',
    key: 'tableRemarkName',
  }, */
]);

async function fetchList(filterData: FilterData) {
  const filterForm = {
    ...filterData,
    filters: {
      ...filterData.filters,
      tags: filterData.filters.tag ? [filterData.filters.tag] : [],
    } as any,
  };
  delete filterForm.filters.tag; // 删除 tag 字段
  return dataSourceApi.getList(filterForm).then((data) => {
    return {
      ...data,
      list: data.records.map((item: any) => ({
        ...item,
        title: item.tableName,
        desc: item.tableDesc || '暂无描述',
        id: item.tableId,
        space: '数据空间',
        tags: item.datasourceTag,
      })),
    };
  });
}

function showPreviewDrawer(id: string) {
  dataSourcePreviewId.value = id;
  dataSourcePreviewVisible.value = true;
}

const operates = ref([
  // { name: '编辑', key: 'edit' },
  // { name: '查看元数据', key: 'viewMetadata' },
  { name: '删除', key: 'delete', icon: 'delete', theme: 'danger' },
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
      showPreviewDrawer(id);
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

function handleCreateDataSource() {}
</script>

<style scoped lang="less">
.data-source-container {
  // height: 2000px;
  height: 100%;
  .filter-form {
    .create-btn {
      flex-shrink: 0;
    }
    display: flex;
    gap: var(--td-size-4);
    justify-content: flex-start;
  }
}
.card-title-status {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  .status-tag {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
    padding: 2px 8px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 4px;
    .status-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    &.ds-status {
      &.enabled {
        background: #e6f7ec;
        color: #00a870;
      }
      &.disabled {
        background: #fbeaea;
        color: #e34d59;
      }
    }
    &.ds-category {
      &.online {
        background: #e6f0ff;
        color: #0052d9;
      }
      &.local {
        background: #fff7e6;
        color: #fa8c16;
      }
    }
  }
}
</style>
