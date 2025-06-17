<template>
  <Sender
    ref="chatSenderRef"
    v-model="inputValue"
    placeholder="按Enter发送，按Shift+Enter换行"
    :loading="sendLoading"
    clearable
    allow-speech
    variant="updown"
    header-animation-timer="300"
    class="chat-sender"
    @submit="handleSubmit"
  >
    <!-- header -->
    <template #header>
      <div class="file-list">
        <files-card
          v-for="item in files"
          :key="item.id"
          img-variant="square"
          v-bind="{ ...item }"
          :color="colorMap[item.fileType]"
          :show-delete-icon="true"
          class="file-card"
          :img-preview-mask="false"
          @delete="handleDeleteFile(item.id)"
        />
      </div>
    </template>

    <template #prefix>
      <t-popup trigger="hover" placement="bottom" content="上传附件">
        <t-button variant="outline" shape="round" @click="openOrCloseHeader(!headerIsOpen)">
          <template #icon>
            <attach-icon />
          </template>
        </t-button>
      </t-popup>
      <t-popup trigger="hover" placement="bottom" content="数据列名快速引用">
        <t-dropdown
          :options="dataColumnNameOptions"
          :max-column-width="120"
          :max-height="200"
          trigger="click"
          placement="top"
          @click="handleInsetColumnName"
        >
          <t-button variant="outline" shape="round">
            <template #icon>
              <table-large-plus-icon width="16px" />
            </template>
          </t-button>
        </t-dropdown>
      </t-popup>
      <t-popup trigger="hover" placement="bottom" content="优化提示词">
        <t-button variant="outline" shape="round" :disabled="!inputValue.trim().length" @click="handleShowPreferDialog">
          <template #icon>
            <filter3-icon />
          </template>
        </t-button>
      </t-popup>
    </template>

    <!-- 操作按钮 -->
    <template #action-list>
      <t-button variant="outline" shape="circle" @click="handleClear">
        <clear-icon />
      </t-button>
      <t-button
        variant="outline"
        shape="circle"
        :disabled="recognizing"
        :loading="recognizing"
        @click="handleRecordClick"
      >
        <template #icon>
          <div v-if="recording" class="recording-animation"></div>
          <microphone1-icon v-else />
        </template>
      </t-button>
      <t-button
        variant="base"
        theme="primary"
        shape="round"
        :disabled="!inputValue.trim().length"
        @click="handleSendClick"
        ><template #icon> <send-icon /> </template
      ></t-button>
    </template>
    <!-- <template v-if="false" #footer>
        <div class="sender-footer">footer</div>
      </template> -->
  </Sender>
  <t-dialog v-model:visible="preferDialogVisible" header="提示词优化" confirm-btn="采用" width="400px">
    <div class="prefer-user-prompt-box">
      <div class="content">
        <div class="prefer-prompt-loader"></div>
      </div>
    </div>
  </t-dialog>
</template>
<script setup lang="ts">
import { AttachIcon, ClearIcon, Filter3Icon, Microphone1Icon, SendIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { provide } from 'vue';
import type { FilesCardProps, FilesType } from 'vue-element-plus-x/types/FilesCard';

import TableLargePlusIcon from '@/assets/chat/TableLargePlus.svg?component';
import VoiceRecognition from '@/utils/voiceRecognition';

/* const props = withDefaults(
  defineProps<{
    value?: string;
    fileIds?: number[];
  }>(),
  {
    value: '',
    fileIds: () => [],
  },
);
const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>(); */

const emit = defineEmits<{
  (
    e: 'send',
    value: {
      question: string;
      fileIds: string[];
    },
  ): void;
}>();
const inputValue = ref('');
const preferDialogVisible = ref(false);
function handleShowPreferDialog() {
  MessagePlugin.info('open dialog');
  preferDialogVisible.value = true;
}

/* const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
}); */

const chatSenderRef = ref();

const sendLoading = ref(false); // 正在发送
const recording = ref(false); // 正在录音
const recognizing = ref(false); // 正在识别语音
const headerIsOpen = ref(false);
const preferUserPromptLoading = ref(false); // 优化提示词

const recordInstance = ref();

type SelfFilesCardProps = FilesCardProps & {
  id?: string;
};

const colorMap: Record<FilesType, string> = {
  word: '#5E74A8',
  excel: '#4A6B4A',
  ppt: '#C27C40',
  pdf: '#5A6976',
  txt: '#D4C58C',
  mark: '#FFA500',
  image: '#8E7CC3',
  audio: '#A67B5B',
  video: '#4A5568',
  three: '#5F9E86',
  code: '#4B636E',
  database: '#4A5A6B',
  link: '#5D7CBA',
  zip: '#8B5E3C',
  file: '#AAB2BF',
  unknown: '#888888',
};

const imageUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';
const typeList = Object.keys(colorMap);

const files = ref<SelfFilesCardProps[]>([
  {
    id: '1',
    name: 'tupian.png',
    fileSize: 1024 * 1024 * 2,
    fileType: 'image',
    url: imageUrl,
    thumbUrl: imageUrl,
    showDelIcon: true,
  },
  {
    id: '1',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: '2',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: '3',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: '4',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: '5',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: '6',
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
]);

function handleClear() {
  inputValue.value = '';
}

function handleRecordClick() {
  // recording.value = !recording.value;
  MessagePlugin.success('录音');
  // 如果正在录音则停止录音
  if (recording.value) {
    recordInstance.value.stop();
    return;
  }
  // 否则销毁录音
  if (recordInstance.value) {
    recordInstance.value.destroy();
  }
  recordInstance.value = new VoiceRecognition((text: string | null, error: string) => {
    if (error) {
      console.error('语音识别错误', error);
      MessagePlugin.warning(`语音识别错误：${error}`);
    } else {
      console.log('识别结果：', text);
      inputValue.value += text;
    }
    // 识别完成 loading状态修改
    recognizing.value = false;
    recording.value = false;
  });

  recordInstance.value.setOnRecordingEndCallback((_: any) => {
    // 开始识别
    recording.value = false;
    recognizing.value = true;
  });

  // 开始录音
  recording.value = true;
  recordInstance.value.start();
}

function handleSendClick() {
  emit('send', {
    question: inputValue.value,
    fileIds: files.value.map((file) => file.id),
  });
  MessagePlugin.success('发送');
}

function handleSubmit(value: string) {
  MessagePlugin.success(`发送${value}`);
}

function _onRecordingChange(value: any) {
  MessagePlugin.success(`录音${value}`);
}

function _handleBeforeUpload(file: any) {
  console.log('before', file);
  if (file.size > 1024 * 1024 * 200) {
    MessagePlugin.error('文件大小不能超过 200MB!');
    return false;
  }
  return true;
}

async function handleHttpRequest(options: any) {
  const formData = new FormData();
  formData.append('file', options.file);
  MessagePlugin.info('上传中...');

  setTimeout(() => {
    const res = {
      message: '文件上传成功',
      fileName: options.file.name,
      uid: options.file.uid,
      fileSize: options.file.size,
      imgFile: options.file,
    };
    files.value.push({
      id: `${files.value.length}`,
      uid: res.uid,
      name: res.fileName,
      fileSize: res.fileSize,
      imgFile: res.imgFile,
      showDelIcon: true,
      imgVariant: 'square',
    });
    MessagePlugin.success('上传成功');
  }, 1000);
}

async function _handleUploadDrop(files: any, props: any) {
  console.log('drop', files);
  console.log('props', props);

  if (files && files.length > 0) {
    if (files[0].type === '') {
      MessagePlugin.error('禁止上传文件夹！');
      return false;
    }

    await Promise.all(files.map((file: any) => handleHttpRequest({ file })));
  }

  return true;
}

function _handleDeleteFileCard(value: any) {
  MessagePlugin.success('删除', value);
}

function openOrCloseHeader(status = true) {
  headerIsOpen.value = status;
  MessagePlugin.success(`展开header${status}`);
  if (status) {
    chatSenderRef.value.openHeader();
  } else {
    chatSenderRef.value.closeHeader();
  }
}

function _focusAll() {
  chatSenderRef.value.focus('all');
}

function _focusStart() {
  chatSenderRef.value.focus('start');
}

function _focusEnd() {
  chatSenderRef.value.focus('end');
}

function _blur() {
  chatSenderRef.value.blur();
}
function handleDeleteFile(id: string) {
  // todo
  console.log('delete file', id);
}

const dataColumnNameOptions = ref([
  {
    content: '数据源1',
    value: 1,
    children: ['列1', '列2', '列3'].map((col) => ({
      content: col,
      value: `数据源1-${col}`,
    })),
  },
  {
    content: '数据源2',
    value: 2,
    children: ['列1', '列2', '列3'].map((col) => ({
      content: col,
      value: `数据源1-${col}`,
    })),
  },
]);

function handleInsetColumnName(value: any) {
  console.log(value);
  inputValue.value += `@{${value.value}}`;
}

const insertTextIntoInput = (text: string) => {
  inputValue.value += text;
};

// provide 方法给祖先组件使用
provide('insertTextIntoInput', insertTextIntoInput);

defineExpose({
  insertTextIntoInput,
});
</script>

<style scoped lang="less">
.chat-sender {
  :deep(.el-sender) {
    &:focus-within {
      border-color: var(--td-brand-color-3) !important;
    }
    &:focus {
      border-color: var(--td-brand-color-3) !important;
    }
  }
}
.file-list {
  display: flex;
  padding: 10px;
  gap: 10px;
  flex-wrap: wrap;
  max-height: 104px;
  overflow-y: auto;

  @icon-size: 20px;
  .file-card {
    padding: 4px;
    background-color: #fff;
    line-height: 1.2;
    // min-width: 36px;
    // aspect-ratio: 1;
    :deep(.elx-files-card-icon) {
      height: @icon-size;
      width: @icon-size;
    }
    :deep(.image-preview-container) {
      height: @icon-size;
      width: @icon-size;
    }
    :deep(.elx-files-card-img) {
      height: 100%;
      width: 100%;
      border-radius: 2px;
    }
    :deep(.elx-files-card-name) {
      font-size: 12px;
      color: var(--td-text-color-primary);
    }
    :deep(.elx-files-card-description) {
      color: var(--td-text-color-placeholder);
    }
  }
}

.sender-footer {
  padding: 10px;
}

@record-loading-color: #000000;
.recording-animation {
  width: 10px;
  aspect-ratio: 0.75;
  --c: no-repeat linear-gradient(@record-loading-color 0 0);
  background:
    var(--c) 0% 50%,
    var(--c) 50% 50%,
    var(--c) 100% 50%;
  animation: l7 3s infinite linear alternate;
}
@keyframes l7 {
  0% {
    background-size:
      20% 50%,
      20% 50%,
      20% 50%;
  }
  20% {
    background-size:
      20% 20%,
      20% 50%,
      20% 50%;
  }
  40% {
    background-size:
      20% 100%,
      20% 20%,
      20% 50%;
  }
  60% {
    background-size:
      20% 50%,
      20% 100%,
      20% 20%;
  }
  80% {
    background-size:
      20% 50%,
      20% 50%,
      20% 100%;
  }
  100% {
    background-size:
      20% 50%,
      20% 50%,
      20% 50%;
  }
}

.prefer-user-prompt-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  .header {
    width: 100%;
  }
  .content {
    // border: var(--td-border-level-1-color) 1px solid;
    width: 100%;
    // background-color: #fff;
    height: 100px;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/** 提示词优化loading */
.prefer-prompt-loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side, var(--td-brand-color) 94%, #0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, var(--td-brand-color));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
