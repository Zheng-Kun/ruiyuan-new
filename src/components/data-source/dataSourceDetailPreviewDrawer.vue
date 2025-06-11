<template>
  <t-drawer v-model:visible="drawerVisible" title="数据预览" size="80%" placement="right">
    <t-tabs v-model="activeTab" class="preview-tabs">
      <!-- 数据源预览 -->
      <t-tab-panel value="preview" label="数据源预览">
        <div class="tab-content">
          <data-source-table :id="props.id" />
        </div>
      </t-tab-panel>

      <!-- 表元数据 -->
      <t-tab-panel value="metadata" label="表元数据">
        <div class="tab-content">
          <!-- 表元数据信息 -->
          <div class="metadata-section">
            <h3 class="section-title">表元数据</h3>
            <t-descriptions :data="tableMetadata" bordered />
          </div>

          <!-- 列元数据信息 -->
          <div class="metadata-section">
            <h3 class="section-title">列元数据</h3>
            <t-table :data="columnMetadata" :columns="columnMetadataColumns" stripe bordered max-height="400px">
              <template #keyType="{ row }">
                <t-tag v-if="row.keyType === 'PRIMARY'" theme="primary" size="small">主键</t-tag>
                <t-tag v-else-if="row.keyType === 'FOREIGN'" theme="warning" size="small">外键</t-tag>
                <t-tag v-else-if="row.keyType === 'INDEX'" theme="default" size="small">索引</t-tag>
                <span v-else>-</span>
              </template>
              <template #allowNull="{ row }">
                <t-tag :theme="row.allowNull ? 'success' : 'danger'" size="small">
                  {{ row.allowNull ? '是' : '否' }}
                </t-tag>
              </template>
            </t-table>
          </div>
        </div>
      </t-tab-panel>

      <!-- AI元数据 -->
      <t-tab-panel value="ai-metadata" label="AI元数据">
        <div class="tab-content">
          <!-- 表描述 -->
          <div class="ai-section">
            <h3 class="section-title">表描述</h3>
            <div class="description-container">
              <t-textarea
                v-model="aiTableDescription"
                placeholder="AI生成的表描述..."
                :maxlength="500"
                :autosize="{ minRows: 3, maxRows: 6 }"
                class="description-input"
              />
              <div class="description-actions">
                <t-button size="small" @click="saveTableDescription"> 保存 </t-button>
              </div>
            </div>
          </div>
          <!-- 列描述 -->
          <div class="ai-section">
            <h3 class="section-title">列描述</h3>
            <t-table :data="aiColumnDescriptions" :columns="aiColumnColumns" stripe bordered max-height="400px">
              <template #description="{ row, index }">
                <t-input
                  :key="index"
                  v-model="row.description"
                  placeholder="AI生成的列描述..."
                  :maxlength="200"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  size="small"
                />
              </template>
            </t-table>
            <div class="ai-actions">
              <t-button @click="saveColumnDescriptions"> 保存所有描述 </t-button>
            </div>
          </div>
        </div>
      </t-tab-panel>
    </t-tabs>
  </t-drawer>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';

// import { computed, ref, watch } from 'vue';
import DataSourceTable from './dataSourceTable.vue';

interface Props {
  id: string;
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 抽屉显示状态
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 当前激活的tab
const activeTab = ref('preview');

// 表元数据
const tableMetadata = ref([
  { label: '表名', value: '' },
  { label: '表类型', value: '' },
  { label: '存储引擎', value: '' },
  { label: '字符集', value: '' },
  { label: '创建时间', value: '' },
  { label: '更新时间', value: '' },
  { label: '行数', value: '' },
  { label: '表注释', value: '' },
]);

// 列元数据
const columnMetadata = ref([]);
const columnMetadataColumns = [
  { colKey: 'columnName', title: '列名', width: 120 },
  { colKey: 'dataType', title: '数据类型', width: 100 },
  { colKey: 'allowNull', title: '允许空值', width: 80, cell: 'allowNull' },
  { colKey: 'keyType', title: '键类型', width: 80, cell: 'keyType' },
  { colKey: 'defaultValue', title: '默认值', width: 100 },
  { colKey: 'extra', title: '额外信息', width: 120 },
  { colKey: 'comment', title: '列注释', minWidth: 150 },
];

// AI元数据
const aiTableDescription = ref('');
const aiColumnDescriptions = ref([]);
const aiColumnColumns = [
  { colKey: 'columnName', title: '列名', width: 120 },
  { colKey: 'dataType', title: '数据类型', width: 100 },
  { colKey: 'description', title: 'AI描述', minWidth: 300, cell: 'description' },
];

// 监听id变化，重新加载数据
watch(
  () => props.id,
  (newId) => {
    if (newId && props.visible) {
      loadData();
    }
  },
);

// 监听抽屉显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible && props.id) {
      loadData();
    }
  },
);

// 加载数据
const loadData = async () => {
  await Promise.all([loadTableMetadata(), loadColumnMetadata(), loadAIMetadata()]);
};

// 加载表元数据
const loadTableMetadata = async () => {
  // TODO: 替换为实际的API调用
  const response = await fetch(`/api/data/${props.id}/metadata`);

  const metadata = response.data;
  tableMetadata.value = [
    { label: '表名', value: metadata.tableName || '-' },
    { label: '表类型', value: metadata.tableType || '-' },
    { label: '存储引擎', value: metadata.engine || '-' },
    { label: '字符集', value: metadata.charset || '-' },
    { label: '创建时间', value: metadata.createTime || '-' },
    { label: '更新时间', value: metadata.updateTime || '-' },
    { label: '行数', value: metadata.rowCount || '-' },
    { label: '表注释', value: metadata.comment || '-' },
  ];
};

// 加载列元数据
const loadColumnMetadata = async () => {
  // TODO: 替换为实际的API调用
  const response = (await fetch(`/api/data/${props.id}/columns`)) as any;
  columnMetadata.value = response.data || [];
};

// 加载AI元数据
const loadAIMetadata = async () => {
  // TODO: 替换为实际的API调用
  const response = (await fetch(`/api/data/${props.id}/ai-metadata`)) as any;
  aiTableDescription.value = response.data.tableDescription || '';
  aiColumnDescriptions.value = response.data.columnDescriptions || [];
};

// 保存表描述
const saveTableDescription = async () => {
  // TODO: 替换为实际的API调用
  await fetch(`/api/data/${props.id}/table-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: aiTableDescription.value }),
  });
  MessagePlugin.success('表描述保存成功');
};

// 保存列描述
const saveColumnDescriptions = async () => {
  // TODO: 替换为实际的API调用
  await fetch(`/api/data/${props.id}/column-descriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descriptions: aiColumnDescriptions.value }),
  });
  MessagePlugin.success('列描述保存成功');
};
</script>

<style scoped lang="less">
.preview-tabs {
  height: 100%;

  :deep(.t-tabs__content) {
    height: calc(100% - 48px);
  }

  :deep(.t-tab-panel) {
    height: 100%;
    overflow: auto;
  }
}

.tab-content {
  padding: 16px;
  height: 100%;
}

.metadata-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.ai-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.description-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.description-input {
  width: 100%;
}

.description-actions {
  display: flex;
  gap: 8px;
}

.ai-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--td-text-color-placeholder);
}
</style>
