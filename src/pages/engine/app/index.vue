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
      ref="filterCardListRef"
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
        <div class="filter-container">
          <t-button theme="primary" variant="outline" class="create-btn" @click="handleCreate">
            <template #icon>
              <t-icon name="add" />
            </template>
            新建{{ cardMode === modeEnum.app ? '应用' : '项目' }}
          </t-button>
          <t-radio-group
            v-model="cardMode"
            variant="primary-filled"
            default-value="1"
            class="filter-item switch-mode"
            @change="handleModeChange"
          >
            <t-radio-button :value="modeEnum.app">应用</t-radio-button>
            <t-radio-button :value="modeEnum.project">项目</t-radio-button>
          </t-radio-group>
          <t-select
            v-if="cardMode === modeEnum.app"
            v-model="filterForm.projectId"
            placeholder="请选择项目"
            class="filter-item"
            :options="projectOptions"
            label="项目"
            clearable
            filterable
          ></t-select>
          <t-select
            v-model="filterForm.tag"
            placeholder="请选择标签"
            class="filter-item"
            :options="tagOptions"
            clearable
            filterable
            label="标签"
          ></t-select>
          <t-input v-model="filterForm.name" placeholder="请输入名称" class="filter-item" label="名称"></t-input>
        </div>
      </template>
    </filter-card-list>
  </div>
  <!-- :mask-btns="maskBtns" -->
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, ref } from 'vue';

import filterCardList from '@/components/card-list/filterCardList.vue';
// import CardList from '@/components/card-list/index.vue';
import { FilterData } from '@/components/card-list/types';

interface Option {
  label: string;
  value: string;
}

const filterCardListRef = ref<InstanceType<typeof filterCardList> | null>(null);

const selectedIds = ref([]); // 示例选中 ID 列表
const modeEnum = {
  app: 'app',
  project: 'project',
};
const cardMode = ref(modeEnum.app);
const filterForm = reactive({
  projectId: '',
  tag: '',
  name: '',
});

const projectOptions = ref<Option[]>([
  { label: '项目1', value: '1' },
  { label: '项目2', value: '2' },
]);
const tagOptions = ref<Option[]>([
  { label: '标签1', value: '1' },
  { label: '标签2', value: '2' },
]);

function getProjectOptions() {
  // TODO
}

function getTagOptions() {
  // TODO 请求应用/项目的标签列表 需要判断
}

function handleModeChange() {
  // 重置过滤条件
  filterForm.projectId = '';
  filterForm.tag = '';
  filterForm.name = '';
  reloadList();
}

function reloadList() {
  if (filterCardListRef.value) {
    nextTick(() => {
      filterCardListRef.value.refreshList();
    });
  }
}

// 应用和项目的 fetchList
const fetchAppList = async (filterData: FilterData) => {
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
      title: `应用 ${start + i + 1}`,
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
const fetchProjectList = async (filterData: FilterData) => {
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
      title: `项目 ${start + i + 1}`,
      desc: `这是项目 ${start + i + 1} 的描述, 描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述`,
      tags: ['标签1', '标签2'],
      projectField1: `项目字段 ${start + i + 1}`,
      projectField2: `项目字段 ${start + i + 1}`,
    })),
    pages: Math.ceil(total / pageSize),
    current: pageNum,
  };
};

// 动态 fetchList
const fetchList = computed(() => {
  return cardMode.value === modeEnum.app ? fetchAppList : fetchProjectList;
});

// infoConfig 配置
const appInfoConfig = [
  { label: '自定义字段1', key: 'customField1' },
  { label: '自定义字段2', key: 'customField2' },
];
const projectInfoConfig = [
  { label: '项目字段1', key: 'projectField1' },
  { label: '项目字段2', key: 'projectField2' },
];

// 动态 infoConfig
const infoConfig = computed(() => {
  return cardMode.value === modeEnum.app ? appInfoConfig : projectInfoConfig;
});

const operates = ref([
  { name: '编辑', key: 'edit' },
  { name: '删除', key: 'delete' },
]);

/* const maskBtns = ref([
  { name: '查看详情', key: 'view', icon: 'search' },
  { name: '分享', key: 'share', icon: 'share' },
]); */

function handleCardClick(id: string) {
  console.log('点击卡片', id);
  if (cardMode.value === modeEnum.app) {
    MessagePlugin.success(`点击应用卡片 ${id}`);
  } else {
    MessagePlugin.success(`点击项目卡片 ${id}`);
    cardMode.value = modeEnum.app; // 切换回应用模式
    filterForm.projectId = id; // 重置项目 ID
    reloadList(); // 刷新列表
  }

  // MessagePlugin.success(`点击卡片 ${id}`);
}

function handleMaskBtnClick(key: string, id: string) {
  console.log('点击遮罩按钮', key, id);
  MessagePlugin.success(`点击遮罩按钮 ${key}:${id}`);
}

function handleOperateClick(value: string, id: string) {
  console.log('点击操作按钮', value, id);
  MessagePlugin.success(`点击操作按钮 ${value}:${id}`);
}

function handleCreate() {}
</script>
<style lang="less" scoped>
.app-inner-container {
  height: 100%;
  .filter-container {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 16px;
    .create-btn {
      flex-shrink: 0;
    }
    // margin-bottom: 16px;
    .filter-item {
      &.switch-mode {
        flex-shrink: 0;
      }
    }
  }
}
</style>
