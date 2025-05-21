<template>
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
      <myLoading />
    </div>

    <!-- 无更多提示 -->
    <div v-if="!loadingMore && !hasMore" class="no-more-tip">没有更多了</div>
  </div>
</template>

<script setup>
import { MessagePlugin } from 'tdesign-vue-next';
import { nextTick, onMounted, ref, watch } from 'vue';

import Card from '@/components/card/index.vue'; // 引入前面定义的 Card 组件
import myLoading from '@/components/loading/index.vue';

const props = defineProps({
  selectedIds: {
    type: Array,
    default: () => [],
  },
  fetchList: {
    type: Function,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  infoConfig: {
    type: Array,
    default: () => [],
  },
  operates: {
    type: Array,
    default: () => [],
  },
  enableClick: {
    type: Boolean,
    default: false,
  },
  maskBtns: {
    type: Array,
    default: () => [],
  },
  canSelect: {
    type: Boolean,
    default: false,
  },
  filterForm: {
    type: Object,
    default: () => ({}),
  },
});

const list = ref([]);
const loadingMore = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const totalPage = ref(0);
const containerRef = ref(null);

const selectedMap = ref({});

const emit = defineEmits(['update:selectedIds', 'card-click', 'operate-click', 'mask-btn-click']);

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
    const { list: newList, totalPage: totalPages, current } = await props.fetchList(currentPage.value, props.pageSize);
    list.value = [...list.value, ...newList].map((el) => ({ ...el, selected: false }));
    currentPage.value = current;
    totalPage.value = totalPages;

    if (currentPage.value >= totalPage.value) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('Error fetching next page:', error);
  } finally {
    loadingMore.value = false;
  }
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

function handleCardClick(id) {
  emit('card-click', id);
}

function handleOperateClick(value, id) {
  emit('operate-click', value, id);
}

function handleMaskBtnClick(key, id) {
  emit('mask-btn-click', key, id);
}
</script>

<style scoped lang="less">
.card-list-container {
  width: 100%;
  // max-height: 600px; // 根据需要调整
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.empty-tip,
.loading-tip,
.no-more-tip {
  text-align: center;
  margin-top: 16px;
  color: #999;
}
</style>
