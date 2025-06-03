<!-- eslint-disable vue-scoped-css/enforce-style-type -->
<template>
  <t-drawer
    v-model:visible="visible"
    header="数据源预览"
    size="50%"
    :footer="false"
    class="data-source-preview-drawer-component"
  >
    <t-tabs v-model="active" theme="normal" scroll-position="auto">
      <t-tab-panel v-for="item in props.list" :key="item.id" :value="item.id" :label="item.name">
        <dataSourceTable :id="item.id"></dataSourceTable>
      </t-tab-panel>
    </t-tabs>
  </t-drawer>
</template>
<script setup lang="ts">
import dataSourceTable from './dataSourceTable.vue';

const props = defineProps<{
  list: {
    id: number;
    name: string;
  }[];
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
}>();
const visible = computed({
  get: () => props.visible,
  set: (val) => {
    emit('update:visible', val);
  },
});

const active = ref(0);
</script>
<style lang="less" global>
.data-source-preview-drawer-component {
  .t-drawer__body {
    padding: initial;
    .t-tabs {
      height: 100%;
    }
    .t-tabs__content {
      height: calc(100% - 48px);
      .t-tab-panel {
        height: 100%;;
      }
    }
  }
}
</style>
