<template>
  <div class="filter-list-container">
    <div class="filter-controls">
      <div class="filter-controls-left">
        <slot name="filters"> </slot>
      </div>
      <t-button @click="applyFilters">筛选</t-button>
    </div>
    <div ref="containerRef" class="card-list-container" @scroll="handleScroll">
      <!-- 卡片列表 -->
      <div v-if="list.length > 0" class="card-grid">
        <card
          v-for="item in list"
          :key="item.id"
          v-model:selected="selectedMap[item.id]"
          class="card-item"
          :info="item"
          :info-config="infoConfig"
          :operates="operates"
          :enable-click="enableClick"
          :mask-btns="maskBtns"
          :can-select="canSelect"
          @card-click="handleCardClick(item.id)"
          @operate-click="handleOperateClick"
          @mask-btn-click="handleMaskBtnClick"
        />
      </div>

      <!-- 空提示 -->
      <div v-else-if="!loadingMore && list.length === 0" class="empty-tip">暂无数据</div>

      <!-- 加载更多提示 -->
      <div v-if="loadingMore" class="loading-tip">
        <my-loading />
      </div>

      <!-- 无更多提示 -->
      <div v-if="!loadingMore && !hasMore" class="no-more-tip">没有更多了</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { defineProps, nextTick, onMounted, ref, watch, withDefaults } from 'vue';

import Card from '@/components/card/index.vue'; // 引入前面定义的 Card 组件
import MyLoading from '@/components/loading/index.vue';

import { FilterData } from './types';

const props = withDefaults(
  defineProps<{
    selectedIds?: string[];
    fetchList: (filterData: FilterData) => Promise<{
      list: any[];
      pages: number;
      current: number;
    }>;
    pageSize?: number;
    infoConfig?: any[];
    operates?: any[];
    enableClick?: boolean;
    maskBtns?: any[];
    canSelect?: boolean;
    filterForm?: Record<string, any>;
  }>(),
  {
    selectedIds: () => [],
    pageSize: 10,
    infoConfig: () => [],
    operates: () => [],
    enableClick: false,
    maskBtns: () => [],
    canSelect: false,
    filterForm: () => ({}),
  },
);

const emit = defineEmits(['update:selectedIds', 'card-click', 'operate-click', 'mask-btn-click']);

defineExpose({
  refreshList,
});

const searchFilterForm = ref<Record<string, any>>({});

const list = ref([]);
const loadingMore = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const totalPage = ref(0);
const containerRef = ref(null);

const selectedMap = ref<Record<string, boolean>>({});

watch(
  selectedMap,
  (newMap) => {
    const ids = Object.keys(newMap).filter((id) => newMap[id]);
    emit('update:selectedIds', ids);
    MessagePlugin.info(`已选择${ids.length}项`);
  },
  { deep: true },
);

async function fetchNextPage() {
  if (loadingMore.value || !hasMore.value) return;

  loadingMore.value = true;

  try {
    const {
      list: newList,
      pages,
      current,
    } = await props.fetchList({ pageNum: currentPage.value, pageSize: props.pageSize, filters: props.filterForm });
    list.value = [...list.value, ...newList].map((el) => ({ ...el, selected: false }));
    currentPage.value = current;
    totalPage.value = pages;

    if (currentPage.value >= totalPage.value) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching next page:', error);
  } finally {
    loadingMore.value = false;
  }
}

function applyFilters() {
  searchFilterForm.value = props.filterForm;
  refreshList();
}

function handleScroll() {
  const container = containerRef.value;
  if (!container) return;

  const { scrollTop, clientHeight, scrollHeight } = container;
  const threshold = 100; // 距离底部多少像素时触发加载

  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    fetchNextPage();
  }
}

function checkAndLoadNextPage() {
  const container = containerRef.value;
  if (!container) return;

  // 检查容器高度是否小于视口高度
  if (container.scrollHeight <= container.clientHeight) {
    fetchNextPage();
  }
}

onMounted(() => {
  fetchNextPage().then(() => {
    nextTick(() => {
      checkAndLoadNextPage();
    });
  });
});

function refreshList() {
  currentPage.value = 1;
  totalPage.value = 0;
  hasMore.value = true;
  list.value = [];
  fetchNextPage();
}

function handleCardClick(id: string) {
  emit('card-click', id);
}

function handleOperateClick(value: string, id: string) {
  emit('operate-click', value, id);
}

function handleMaskBtnClick(key: string, id: string) {
  emit('mask-btn-click', key, id);
}
</script>

<style scoped lang="less">
.filter-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter-controls {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
  }
  .card-list-container {
    flex: 1;
    width: 100%;
    // max-height: 600px; // 根据需要调整
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
  }
}

@space-between-card: 20px;
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: @space-between-card;
}

.empty-tip,
.loading-tip,
.no-more-tip {
  text-align: center;
  margin-top: @space-between-card;
  color: var(--td-text-color-placeholder);
}
</style>
