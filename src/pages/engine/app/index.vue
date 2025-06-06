<template>
  <div class="app-inner-container">
    <!-- <card-list
      v-model:selected-ids="selectedIds"
      :fetch-list="fetchList"
      :page-size="10"
      :info-config="infoConfig"
      :operates="operates"
      :enable-click="true"
      :can-select="false"
      @card-click="handleCardClick"
      @operate-click="handleOperateClick"
      @mask-btn-click="handleMaskBtnClick"
    /> -->
    <filter-card-list
      v-model:selected-ids="selectedIds"
      :fetch-list="fetchList"
      :page-size="10"
      :info-config="infoConfig"
      :operates="operates"
      :enable-click="true"
      :can-select="false"
      :filter-form="filterForm"
      @card-click="handleCardClick"
      @operate-click="handleOperateClick"
      @mask-btn-click="handleMaskBtnClick"
    >
      <template #filters>
        <t-input v-model="filterForm.name" placeholder="请输入名称"></t-input>
      </template>
    </filter-card-list>
  </div>
  <!-- :mask-btns="maskBtns" -->
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

import filterCardList from '@/components/card-list/filterCardList.vue';
// import CardList from '@/components/card-list/index.vue';
import { FilterData } from '@/components/card-list/types';

const selectedIds = ref([]); // 示例选中 ID 列表
const filterForm = ref({
  name: '',
});

const fetchList = async (filterData: FilterData) => {
  // 模拟分页数据获取
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  const { pageNum, pageSize } = filterData;
  const total = 50; // 总数据量
  const start = (pageNum - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return {
    list: Array.from({ length: end - start }, (_, i) => ({
      id: start + i + 1,
      title: `卡片 ${start + i + 1}`,
      desc: `这是卡片 ${start + i + 1} 的描述, 描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述`,
      tags: ['标签1', '标签2'],
      customField1: `自定义字段 ${start + i + 1}`,
      customField2: `自定义字段 ${start + i + 1}`,
      customField3: `自定义字段 ${start + i + 1}`,
      customField4: `自定义字段 ${start + i + 1}`,
    })),
    pages: Math.ceil(total / pageSize),
    current: pageNum,
  };
};

const infoConfig = ref([
  // { label: '自定义字段1', key: 'customField1' },
  // { label: '自定义字段2', key: 'customField2' },
  // { label: '自定义字段3', key: 'customField3' },
  // { label: '自定义字段4', key: 'customField4' },
]);

const operates = ref([
  { name: '编辑', key: 'edit' },
  { name: '删除', key: 'delete' },
]);

/* const maskBtns = ref([
  { name: '查看详情', key: 'view', icon: 'search' },
  { name: '分享', key: 'share', icon: 'share' },
]); */

function handleCardClick(id: number) {
  console.log('点击卡片', id);
  MessagePlugin.success(`点击卡片 ${id}`);
}

function handleMaskBtnClick(key: string, id: number) {
  console.log('点击遮罩按钮', key, id);
  MessagePlugin.success(`点击遮罩按钮 ${key}:${id}`);
}

function handleOperateClick(value: string, id: number) {
  console.log('点击操作按钮', value, id);
  MessagePlugin.success(`点击操作按钮 ${value}:${id}`);
}
</script>
<style lang="less" scoped>
.app-inner-container {
  height: 100%;
}
</style>
