<template>
  <div class="agent-generator-container">
    <chat-side-bar v-model:active-chat="activeChat" type="engine" />
    <div class="chat-right">
      <t-row :gutter="10" class="header-container">
        <t-col :span="2">
          <t-select
            v-model="environment.projectId"
            class="config-item"
            :options="projectOptions"
            placeholder="请选择项目"
            clearable
            label="项目"
            filterable
            @update:model-value="fetchAppOptions"
          />
        </t-col>
        <t-col :span="2">
          <t-select
            v-model="environment.appId"
            :options="appOptions"
            class="config-item"
            placeholder="请选择应用"
            filterable
            clearable
            label="应用"
            @update:model-value="fetchVersionOptions"
          />
        </t-col>
        <t-col :span="2">
          <t-select
            v-model="environment.versionId"
            :options="versionOptions"
            placeholder="请选择版本"
            class="config-item"
            clearable
            filterable
            label="版本"
            @update:model-value="fetchVersionOptions"
          />
        </t-col>
        <t-col :span="4" class="data-source-config-container">
          <t-badge :count="environment.dataSourceIds.length">
            <t-select
              v-model="environment.dataSourceIds"
              :options="dataSourceOptions"
              placeholder="请选择数据源"
              class="config-item data-source-select"
              clearable
              multiple
              filterable
              :min-collapsed-num="2"
              label="数据源"
            />
          </t-badge>
          <t-popup content="预览数据源">
            <t-button
              variant="text"
              theme="default"
              shape="circle"
              :disabled="environment.dataSourceIds.length === 0"
              class="data-source-preview-btn"
              @click="handleShowDataSourcePreview"
            >
              <template #icon>
                <manage-search-round-icon width="20px" />
              </template>
            </t-button>
          </t-popup>
        </t-col>
        <t-col :span="2">
          <t-select
            v-model="environment.templateId"
            :options="templateOptions"
            placeholder="请选择分析模板"
            class="config-item"
            clearable
            label="模板"
          />
        </t-col>
        <!-- @focus="fetchProjectOptions" -->
      </t-row>
      <div class="bottom-container" :class="{ 'show-preview': activeChat !== 0,'hide-preview': activeChat === 0 }">
        <chat-message
          type="engine"
          :session-id="activeChat"
          class="chat-content"
          :class="{
            'is-new-session': activeChat === 0,
          }"
        ></chat-message>
        <div v-if="environment.versionId && activeChat !== 0" class="preview-container">预览位置</div>
      </div>
    </div>
    <!-- <div>{{ activeChat }}</div> -->
    <dataSourcePreviewDrawer v-model:visible="dataSourcePreviewVisible" :list="dataSourcePreviewList" />
  </div>
</template>
<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';

import appApi from '@/api/app';
import commonApi from '@/api/common';
import ManageSearchRoundIcon from '@/assets/app/ManageSearchRounded.svg?component';
import ChatMessage from '@/components/chat/chatMessage.vue';
import ChatSideBar from '@/components/chat/chatSideBar.vue';
import dataSourcePreviewDrawer from '@/components/data-source/dataSourcePreviewDrawer.vue';
import { DropdownKeyEnum } from '@/constants';

const props = withDefaults(
  defineProps<{
    mode: 'edit' | 'create';
    id: string;
  }>(),
  {
    mode: 'edit',
    id: '0',
  },
);

const id = computed(() => {
  return +props.id;
});

const activeChat = ref(1);
interface Options {
  label: string;
  value: number;
}

const environment = reactive({
  projectId: 1,
  appId: 1,
  versionId: 1,
  dataSourceIds: [] as number[],
  templateId: 1,
});

const dataSourcePreviewVisible = ref(false);
const dataSourcePreviewList = computed(() => {
  return environment.dataSourceIds.map((id) => ({
    id,
    name: dataSourceOptions.value.find((option) => option.value === id)?.label,
  }));
});

function handleShowDataSourcePreview() {
  dataSourcePreviewVisible.value = true;
}

onMounted(() => {
  init();
  fetchOptions();
});

const projectOptions = ref<Options[]>([
  { label: '项目1afdadfdsdf', value: 1 },
  { label: '项目2', value: 2 },
  { label: '项目3', value: 3 },
  { label: '项目4', value: 4 },
  { label: '项目5', value: 5 },
]);
const appOptions = ref<Options[]>([
  { label: '应用1adfasdfasdfad', value: 1 },
  { label: '应用2', value: 2 },
  { label: '应用3', value: 3 },
  { label: '应用4', value: 4 },
  { label: '应用5', value: 5 },
]);
const versionOptions = ref<Options[]>([
  { label: '版本1adfadfasdfas', value: 1 },
  { label: '版本2', value: 2 },
  { label: '版本3', value: 3 },
  { label: '版本4', value: 4 },
  { label: '版本5', value: 5 },
]);
const dataSourceOptions = ref<Options[]>([
  { label: '数据源1adfafdasdfsdf', value: 1 },
  { label: '数据源2', value: 2 },
  { label: '数据源3', value: 3 },
  { label: '数据源4', value: 4 },
  { label: '数据源5', value: 5 },
]);
const templateOptions = ref<Options[]>([
  { label: '分析模板1adfadfasdfafd', value: 1 },
  { label: '分析模板2', value: 2 },
  { label: '分析模板3', value: 3 },
  { label: '分析模板4', value: 4 },
  { label: '分析模板5', value: 5 },
]);

function fetchProjectOptions() {
  MessagePlugin.info('正在加载项目列表，请稍候...');
  commonApi.getOptions(DropdownKeyEnum.project).then((data) => {
    projectOptions.value = data;
  });
}

function fetchAppOptions() {}
function fetchVersionOptions() {}
function fetchDataSourceOptions() {}
function fetchTemplateOptions() {}

function fetchOptions() {
  fetchProjectOptions();
  fetchTemplateOptions();
  if (environment.projectId) {
    fetchAppOptions();
    fetchDataSourceOptions();
  }
  if (environment.appId) fetchVersionOptions();
}

function fetchAppDetail() {}

function getTemporaryAppId() {
  appApi.getTemporaryAppId().then((data) => {
    environment.appId = data;
    fetchAppDetail();
  });
}

async function init() {
  if (props.mode === 'edit') {
    environment.appId = id.value;
    await fetchAppDetail();
    // TODO 改为详情中的detail
    activeChat.value = 0;
  } else {
    activeChat.value = 0;
    getTemporaryAppId();
  }
  fetchOptions();
}
</script>

<style scoped lang="less">
.agent-generator-container {
  height: 100%;
  width: 100%;
  display: flex;
  background-color: var(--td-bg-color-page);
  .chat-right {
    height: 100%;
    flex: 1;
    padding: 10px;
    min-width: 900px;
    .header-container {
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-bottom: 10px;
      padding: 0 10px;
      height: 50px;
      border-radius: 10px;
      background-color: var(--td-bg-color-container);
      // border-radius: 10px 0 0 10px;
      // display: flex;
      // flex-direction: row;
      align-items: center;
      justify-content: center;
      // padding: 0 20px;
      // font-size: 16px;
      // color: var(--td-text-color-primary);
      .data-source-config-container {
        display: flex;
        :deep(.t-badge) {
          flex: 1;
        }
        :deep(.t-tag) {
          span {
            max-width: 60px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .config-item {
        &.data-source-select {
          :deep(.t-input) {
            height: 32px;
            overflow-y: auto;
          }
        }
      }
      :deep(.t-badge--circle) {
        z-index: 1;
      }
      .data-source-preview-btn {
        margin-left: 4px;
      }
    }
    .bottom-container {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: row;
      gap: 10px;
      position: relative;
      /* &.show-preview {
        .chat-content {
          padding-right: 30px;
        }
      } */
      .chat-content {
        flex: 1;
        height: 100%;
        width: 40%;
        overflow: hidden;
        background-color: var(--td-bg-color-container);
        // border-radius: 10px 0 0 10px;
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        &.is-new-session {
          background-color: var(--td-bg-color-page);
          box-shadow: none;;
        }
      }
      .preview-container {
        width: 60%;
        background-color: var(--td-bg-color-container);
        border-radius: 10px 10px 10px 10px;
        padding: 20px;
        // margin-left: -10px;
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
