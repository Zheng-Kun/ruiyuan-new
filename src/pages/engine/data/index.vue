<template>
  <div class="data-container">
    <t-tabs v-model="activeTab" placement="left" class="data-tabs">
      <t-tab-panel
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      >
        <router-view v-if="activeTab === tab.value" />
      </t-tab-panel>
    </t-tabs>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute} from 'vue-router'
const router = useRouter();
const route = useRoute();

const tabs = computed(() => {
  // match 到的第二个为二级路由
  const matched = route.matched[1];
  console.log(route.matched);
  if (!matched || !matched.children) return [];

  return matched.children.map((child) => ({
    value: child.path.startsWith('/') ? child.path : `${matched.path}/${child.path}`,
    label: getRouteTitle(child.meta?.title as any),
  }))
})

// 默认激活第一个tab
const activeTab = ref(tabs.value[0]?.value);

function getRouteTitle(title: string | Record<string, string>){
  if (typeof title === 'string') {
    return title;
  }
  return title.zh_CN;
}

// 切换tab时跳转路由
watch(activeTab, (val) => {
  if (val && route.path !== val) {
    console.log('切换tab', val)
    router.push({ path: val });
  }
});
</script>

<style scoped lang="less">
.data-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: var(--td-bg-color-page);
  :deep(.t-tabs__header.t-is-left), :deep(.t-tabs__nav), :deep(.t-tabs__nav-container.t-is-left) {
    height: 100%;
  }
  .data-tabs {
    border-radius: var(--td-radius-large);
    overflow: hidden;
    padding: var(--td-size-5)
  }
  .data-tabs, :deep(.t-tabs__content), :deep(.t-tab-panel) {
    height: 100%;
  }
  :deep(.t-tab-panel){
    padding-left: var(--td-size-5);
  }
}
</style>
