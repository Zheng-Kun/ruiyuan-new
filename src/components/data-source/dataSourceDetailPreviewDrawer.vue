<template>
  <t-drawer v-model:visible="drawerVisible" size="80%" class="data-source-preview-drawer">
    <t-tabs v-model="activeTab" class="preview-tabs">
      <!-- 数据源预览 -->
      <t-tab-panel value="preview" label="数据预览">
        <div class="tab-content">
          <data-source-table :id="props.id" />
        </div>
      </t-tab-panel>

      <!-- 表元数据 -->
      <t-tab-panel value="metadata" label="表元数据">
        <div class="tab-content">
          <!-- 表元数据信息 -->
          <div class="metadata-section">
            <h3 class="section-title">启用数据</h3>
            <div>
              <t-switch
                v-model="dataSourceStatus"
                :label="['启用', '禁用']"
                :custom-value="[true, false]"
                size="large"
                :loading="statusChangeLoading"
                :before-change="handleStatusChange"
              />
              <t-alert theme="warning" class="alert-warning">
                <template #message>数据源被禁用后将不能被试用于各个分析，已引用的分析将无法获取数据</template>
              </t-alert>
            </div>
          </div>
          <!-- 表元数据信息 -->
          <div class="metadata-section">
            <h3 class="section-title">表元数据</h3>
            <t-descriptions :column="3" size="small" bordered>
              <t-descriptions-item v-for="item in tableMetadata" :key="item.label" :label="item.label">
                {{ item.value }}
              </t-descriptions-item>
            </t-descriptions>
          </div>

          <!-- 列元数据信息 -->
          <div class="metadata-section">
            <h3 class="section-title">列元数据</h3>
            <t-table
              :data="columnMetadata"
              :columns="columnMetadataColumns"
              stripe
              bordered
              max-height="400px"
              row-key="index"
            >
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
          <!-- <t-row :gutter="16"> -->
          <!-- 表名称 -->
          <!-- <t-col :span="6">
              <div class="ai-section">
                <h3 class="section-title">数据源名称</h3>
                <div class="description-container">
                  <t-input
                    v-model="dataSourceName"
                    placeholder="数据源名称..."
                    :maxlength="20"
                    class="nickname-input"
                  />
                  <div class="description-actions">
                    <t-button size="small" @click="saveTableDescription"> 保存 </t-button>
                  </div>
                </div>
              </div>
            </t-col> -->
          <!-- <t-col :span="6"> -->
          <div class="ai-section">
            <h3 class="section-title">数据源标签</h3>
            <div class="description-container">
              <!-- <t-select
                    v-model="dataSourceTags"
                    creatable
                    filterable
                    placeholder="输入后回车以创建新标签"
                    :options="tagOptions"
                    style="width: 400px"
                    multiple
                    @create="createOptions"
                  /> -->
              <div class="checkout-and-tag-container">
                <t-check-tag-group
                  v-model="dataSourceTags"
                  :options="tagOptions"
                  :checked-props="{
                    theme: 'primary',
                    variant: 'outline',
                  }"
                  :unchecked-props="{
                    theme: 'default',
                    variant: 'outline',
                  }"
                  multiple
                />
                <div class="add-tag-container">
                  <t-tag v-if="!tagInputVisible" class="add-tag-button" @click="handleClickAddTag">
                    <add-icon />
                    添加标签
                  </t-tag>
                  <t-input
                    v-else
                    ref="tagInputRef"
                    size="small"
                    style="width: 94px"
                    @blur="createOptions"
                    @enter="createOptions"
                  />
                </div>
              </div>
              <!-- <div class="description-actions">
                    <t-button size="small" @click="saveTableDescription"> 保存 </t-button>
                  </div> -->
            </div>
          </div>
          <!-- </t-col>
          </t-row> -->
          <!-- 表标签 -->
          <!-- 表描述 -->
          <div class="ai-section">
            <h3 class="section-title">表描述</h3>
            <div class="description-container">
              <t-textarea
                v-model="aiTableDescription"
                placeholder="AI生成的表描述..."
                :maxlength="1000"
                :autosize="{ minRows: 3, maxRows: 6 }"
                class="description-input"
              />
              <!-- <div class="description-actions">
                <t-button size="small" @click="saveTableDescription"> 保存 </t-button>
              </div> -->
            </div>
          </div>
          <!-- 列描述 -->
          <div class="ai-section">
            <h3 class="section-title">列描述</h3>
            <t-table
              :data="aiColumnDescriptions"
              :columns="aiColumnColumns"
              stripe
              bordered
              max-height="400px"
              row-key="index"
            >
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
            <!-- <div class="ai-actions">
              <t-button size="small" @click="saveColumnDescriptions"> 保存所有描述 </t-button>
            </div> -->
          </div>
        </div>
      </t-tab-panel>
    </t-tabs>
    <template #footer>
      <div>
        <t-button theme="primary" variant="base" @click="handleSave">保存</t-button>
      </div>
    </template>
  </t-drawer>
</template>

<script setup lang="ts">
import { AddIcon } from 'tdesign-icons-vue-next';
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

// 数据源状态
const dataSourceStatus = ref<boolean>(true);
const statusChangeLoading = ref(false);

// 切换数据源状态
function handleStatusChange(): Promise<boolean> {
  statusChangeLoading.value = true;
  return new Promise((resolve) => {
    // 模拟状态切换延迟
    setTimeout(() => {
      console.log('切换数据源状态:', dataSourceStatus.value);
      // dataSourceStatus.value = !dataSourceStatus.value;
      MessagePlugin.success(`数据源已${!dataSourceStatus.value ? '启用' : '禁用'}`);
      resolve(true);
      statusChangeLoading.value = false;
    }, 1000);
  });
}

// 表元数据
const tableMetadata = ref([
  { label: '数据库', value: '' },
  { label: '表名', value: '' },
  { label: '存储引擎', value: '' },
  { label: '行数', value: '' as number | string },
  { label: '平均行长度', value: '' as number | string },
  { label: '数据长度（字节）', value: '' as number | string },
  { label: '最大数据长度', value: '' as number | string },
  { label: '索引长度（字节）', value: '' as number | string },
  { label: '自增值', value: '' as number | string },
  { label: '字符集', value: '' as number | string },
  { label: '创建时间', value: '' as number | string },
  { label: '更新时间', value: '' as number | string },
  { label: '表注释', value: '' as number | string },
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
// const dataSourceName = ref('');
const dataSourceTags = ref<string[]>([]);
const aiTableDescription = ref('');
const aiColumnDescriptions = ref([]);
const aiColumnColumns = [
  { colKey: 'columnName', title: '列名', width: 120 },
  { colKey: 'dataType', title: '数据类型', width: 100 },
  { colKey: 'description', title: 'AI描述', minWidth: 300, cell: 'description' },
];
const tagOptions = ref([
  { label: '标签1', value: '标签1' },
  { label: '标签2', value: '标签2' },
  { label: '标签3', value: '标签3' },
]);

function createOptions(value: string | number | boolean) {
  // console.log('创建新选项:', value);
  // MessagePlugin.success(`创建新选项: ${value}`);
  const trimmedValue = String(value).trim();
  if (
    value !== undefined &&
    value !== null &&
    trimmedValue.length > 0 &&
    !tagOptions.value.some((option) => option.value === trimmedValue)
  ) {
    tagOptions.value.push({ label: String(trimmedValue), value: String(trimmedValue) });
    tagInputRef.value.value = ''; // 清空输入框
  }
  tagInputVisible.value = false; // 隐藏输入框
}

const tagInputVisible = ref(false);
const tagInputRef = ref<HTMLInputElement | null>(null);

const handleClickAddTag = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value.focus();
  });
};

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
  // Mock 数据
  const metadata = {
    dataBase: 'test_db',
    tableName: 'test_table',
    engine: 'InnoDB',
    rowCount: 1000,
    avgRowLength: 128,
    dataLength: 128000,
    maxDataLength: 512000,
    indexLength: 64000,
    autoIncrement: 101,
    charset: 'utf8mb4',
    createTime: '2023-06-01 12:00:00',
    updateTime: '2023-06-10 15:30:00',
    comment: '这是一个测试表',
  };

  tableMetadata.value = [
    { label: '数据库', value: metadata.dataBase || '-' },
    { label: '表名', value: metadata.tableName || '-' },
    { label: '存储引擎', value: metadata.engine || '-' },
    { label: '行数', value: metadata.rowCount || '-' },
    { label: '平均行长度', value: metadata.avgRowLength || '-' },
    { label: '数据长度（字节）', value: metadata.dataLength || '-' },
    { label: '最大数据长度', value: metadata.maxDataLength || '-' },
    { label: '索引长度（字节）', value: metadata.indexLength || '-' },
    { label: '自增值', value: metadata.autoIncrement || '-' },
    { label: '字符集', value: metadata.charset || '-' },
    { label: '创建时间', value: metadata.createTime || '-' },
    { label: '更新时间', value: metadata.updateTime || '-' },
    { label: '表注释', value: metadata.comment || '-' },
  ];
};

// 加载列元数据
const loadColumnMetadata = async () => {
  // Mock 数据
  columnMetadata.value = [
    {
      columnName: 'id',
      dataType: 'INT',
      allowNull: false,
      keyType: 'PRIMARY',
      defaultValue: null,
      extra: 'auto_increment',
      comment: '主键ID',
    },
    {
      columnName: 'name',
      dataType: 'VARCHAR(255)',
      allowNull: true,
      keyType: '',
      defaultValue: null,
      extra: '',
      comment: '名称',
    },
    {
      columnName: 'created_at',
      dataType: 'DATETIME',
      allowNull: false,
      keyType: '',
      defaultValue: 'CURRENT_TIMESTAMP',
      extra: '',
      comment: '创建时间',
    },
  ];
};

// 加载AI元数据
const loadAIMetadata = async () => {
  // Mock 数据
  aiTableDescription.value = '这是一个测试表，用于存储用户信息。';
  aiColumnDescriptions.value = [
    {
      columnName: 'id',
      dataType: 'INT',
      description: '主键，唯一标识每条记录。',
    },
    {
      columnName: 'name',
      dataType: 'VARCHAR(255)',
      description: '用户的名称。',
    },
    {
      columnName: 'created_at',
      dataType: 'DATETIME',
      description: '记录的创建时间。',
    },
  ];
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

/**
 * @description: 保存元数据
 * @return {*}
 */
function handleSave() {}
</script>

<style scoped lang="less">
.data-source-preview-drawer {
  .t-drawer__body {
    padding: 0;
  }
  :deep(.t-drawer__body) {
    padding: 0 !important;
  }
}
.preview-tabs {
  height: 100%;

  :deep(.t-tabs__content) {
    height: calc(100% - 48px);
  }

  :deep(.t-tab-panel) {
    height: 100%;
    overflow: auto;
    padding-left: 0;
  }
}

.tab-content {
  padding: 16px;
  padding-bottom: 10px;
  height: 100%;
}

.metadata-section {
  margin-bottom: 24px;
  .alert-warning {
    margin-top: 10px;
  }

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
  .checkout-and-tag-container {
    display: flex;
    .add-tag-container {
      margin-left: 8px;
      .add-tag-button {
        cursor: pointer;
      }
    }
  }
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

<style lang="less">
.data-source-preview-drawer {
  .t-drawer__body {
    padding: 10px;
    padding-bottom: 0;
  }
}
</style>
