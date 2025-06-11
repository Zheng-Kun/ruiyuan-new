<template>
  <div class="data-container">
    <t-tabs v-if="tabs.length" v-model="activeTab" placement="left" class="data-tabs">
      <t-tab-panel v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label">
        <router-view />
      </t-tab-panel>
    </t-tabs>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const tabs = computed(() => {
  const matched = route.matched.find((m) => m.path === '/engine/data');
  if (!matched || !matched.children) return [];
  return matched.children.map((child) => ({
    value: child.path.startsWith('/') ? child.path : `${matched.path}/${child.path}`,
    label: getRouteTitle(child.meta?.title as any),
  }));
});

function getRouteTitle(title: string | Record<string, string>) {
  if (typeof title === 'string') {
    return title;
  }
  return title.zh_CN;
}

const activeTab = computed({
  get: () => route.path,
  set: (val) => {
    if (val && route.path !== val) {
      router.push({ path: val });
    }
  },
});

// 监听路由变化，确保 tabs 和 activeTab 同步
watch(
  () => route.path,
  () => {
    console.log('Route changed:', route.path);
  },
);
</script>

<style scoped lang="less">
.data-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: var(--td-bg-color-page);
  :deep(.t-tabs__header.t-is-left),
  :deep(.t-tabs__nav),
  :deep(.t-tabs__nav-container.t-is-left) {
    height: 100%;
  }
  .data-tabs {
    border-radius: var(--td-radius-large);
    overflow: hidden;
    padding: var(--td-size-5);
  }
  .data-tabs,
  :deep(.t-tabs__content),
  :deep(.t-tab-panel) {
    height: 100%;
  }
  :deep(.t-tab-panel) {
    padding-left: var(--td-size-5);
  }
}
</style>
