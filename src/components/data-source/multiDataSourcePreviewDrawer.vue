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
        <dataSourceTable
          :id="item.id"
          enable-header-click
          @table-header-click="handleTableHeaderClick"
        ></dataSourceTable>
      </t-tab-panel>
    </t-tabs>
  </t-drawer>
</template>
<script setup lang="ts">
import dataSourceTable from './dataSourceTable.vue';

const props = defineProps<{
  list: {
    id: string;
    name: string;
  }[];
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (
    e: 'tableHeaderClick',
    val: string, // 【${tableName}表(ID:${tableId})的${columnName}列】
  ): void;
}>();
const visible = computed({
  get: () => props.visible,
  set: (val) => {
    emit('update:visible', val);
  },
});

const active = ref('');

function handleTableHeaderClick(col: any) {
  const colStringTemplate = '【{{tableName}}表(ID:{{tableId}})的{{columnName}}列】';
  const columnName = col.colKey;
  const tableId = active.value;
  const tableName = props.list.find((item) => item.id === tableId)?.name || '';
  emit(
    'tableHeaderClick',
    `${colStringTemplate.replace('tableName', tableName).replace('tableId', tableId).replace('columnName', columnName)}`,
  );
}

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      active.value = props.list[0].id; // 重置为第一个tab
    }
  },
  { immediate: true },
);
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
        height: 100%;
      }
    }
  }
}
</style>
