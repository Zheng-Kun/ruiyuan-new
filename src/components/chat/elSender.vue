<template>
  <Sender
    ref="chatSenderRef"
    v-model="value"
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
      <t-button variant="outline" shape="round" @click="openOrCloseHeader(!headerIsOpen)">
        <template #icon>
          <attach-icon />
        </template>
      </t-button>
      <t-popup trigger="click" placement="top" show-arrow>
        <t-button variant="outline" shape="round" :disabled="!value.trim().length" @click="handleSendClick">
          <template #icon>
            <filter3-icon />
          </template>
          一键优化
        </t-button>
        <template #content>
          <div class="prefer-user-prompt-box">
            <h3 class="header">提示词优化</h3>
            <div class="content">
              <div class="prefer-prompt-loader"></div>
            </div>
            <div class="footer">
              <t-popup content="将优化后的提示词替换掉原来的提示词" placement="top">
                <t-button variant="base" theme="primary">采用</t-button>
              </t-popup>
            </div>
          </div>
        </template>
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
      <t-button variant="base" theme="primary" shape="round" :disabled="!value.trim().length" @click="handleSendClick"
        ><template #icon> <send-icon /> </template
      ></t-button>
    </template>
    <template v-if="false" #footer>
      <div class="sender-footer">footer</div>
    </template>
  </Sender>
</template>
<script setup lang="ts">
import { AttachIcon, ClearIcon, Filter3Icon, Microphone1Icon, SendIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, ref } from 'vue';
import type { FilesCardProps, FilesType } from 'vue-element-plus-x/types/FilesCard';

import VoiceRecognition from '@/utils/voiceRecognition';

const props = defineProps<{
  value: string;
}>();
const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>();

const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
});

const chatSenderRef = ref();

const sendLoading = ref(false); // 正在发送
const recording = ref(false); // 正在录音
const recognizing = ref(false); // 正在识别语音
const headerIsOpen = ref(false);
const preferUserPromptLoading = ref(false); // 优化提示词

const recordInstance = ref();

type SelfFilesCardProps = FilesCardProps & {
  id?: number;
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
    id: 1,
    name: 'tupian.png',
    fileSize: 1024 * 1024 * 2,
    fileType: 'image',
    url: imageUrl,
    thumbUrl: imageUrl,
    showDelIcon: true,
  },
  {
    id: 1,
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: 2,
    name: '文件.txt',
    fileSize: 1024 * 2,
    fileType: typeList[Math.floor(Math.random() * typeList.length)] as FilesType,
    url: 'http:// www.baidu.com',
    thumbUrl: 'http://www.baidu.com',
    imgFile: new File([], 'text.txt'),
    showDelIcon: true,
  },
  {
    id: 3,
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
  value.value = '';
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
      value.value += text;
    }
    // 识别完成 loading状态修改
    recognizing.value = false;
    recording.value = false;
  });

  recordInstance.value.setOnRecordingEndCallback((_) => {
    // 开始识别
    recording.value = false;
    recognizing.value = true;
  });

  // 开始录音
  recording.value = true;
  recordInstance.value.start();
}

function handleSendClick() {
  MessagePlugin.success('发送');
}

function handleSubmit(value: string) {
  MessagePlugin.success(`发送${value}`);
}

function onRecordingChange(value: any) {
  MessagePlugin.success(`录音${value}`);
}

function handleBeforeUpload(file: any) {
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
  ElMessage.info('上传中...');

  setTimeout(() => {
    const res = {
      message: '文件上传成功',
      fileName: options.file.name,
      uid: options.file.uid,
      fileSize: options.file.size,
      imgFile: options.file,
    };
    files.value.push({
      id: files.value.length,
      uid: res.uid,
      name: res.fileName,
      fileSize: res.fileSize,
      imgFile: res.imgFile,
      showDelIcon: true,
      imgVariant: 'square',
    });
    ElMessage.success('上传成功');
  }, 1000);
}

async function handleUploadDrop(files: any, props: any) {
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

function handleDeleteFileCard(value: any) {
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

function focusAll() {
  chatSenderRef.value.focus('all');
}

function focusStart() {
  chatSenderRef.value.focus('start');
}

function focusEnd() {
  chatSenderRef.value.focus('end');
}

function blur() {
  chatSenderRef.value.blur();
}
function handleDeleteFile(id: number) {
  // todo
  console.log('delete file', id);
}
</script>

<style scoped lang="less">
.chat-sender {
  &:focus-within {
    border-color: var(--td-brand-color) !important;
  }
}
.file-list {
  display: flex;
  padding: 10px;
  gap: 10px;

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
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  .header {
    width: 100%;
  }
  .content {
    border: var(--td-border-level-1-color) 1px solid;
    width: 100%;
    // background-color: #fff;
    height: 100px;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: end;
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
