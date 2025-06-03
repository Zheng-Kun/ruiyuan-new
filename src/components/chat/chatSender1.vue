<template>
  <t-chat-sender
    ref="chatSenderRef"
    v-model="value"
    class="chat-sender"
    :stop-disabled="loading"
    :textarea-props="{
      placeholder: '按Shift + Enter 换行，按 Enter 发送',
    }"
    @send="inputEnter"
    @file-select="fileSelect"
  >
    <!-- 自定义操作区域的内容，默认支持图片上传、附件上传和发送按钮 -->
    <template #suffix="{ renderPresets }">
      <!-- 在这里可以进行自由的组合使用，或者新增预设 -->
      <!-- 不需要附件操作的使用方式 -->
      <component :is="renderPresets([{ name: 'uploadAttachment' }])" />
      <!-- <component :is="renderPresets([])" /> -->
      <!-- 只需要附件上传的使用方式-->
      <!-- 只需要图片上传的使用方式-->
      <!-- <component :is="renderPresets([{ name: 'uploadImage' }])" /> -->
      <!-- 任意配置顺序-->
      <!-- <component :is="renderPresets([{ name: 'uploadAttachment' }, { name: 'uploadImage' }])" /> -->
    </template>
    <!-- <template #suffix>
      <t-button theme="default" variant="text" size="large" class="btn"> 发送 </t-button>
    </template> -->
    <template #prefix>
      <!-- <component :is="renderPresets([{ name: 'uploadAttachment' }])" /> -->
    </template>
    <template #header> 外部header </template>
    <template #inner-header> 内部header </template>
  </t-chat-sender>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    value: string;
    files?: number[];
  }>(),
  {
    value: '',
    files: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:value', val: string): void;
  (e: 'update:files', files: number[]): void;
}>();

const value = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val);
  },
});

const files = computed({
  get: () => props.files,
  set: (files) => {
    emit('update:files', files);
  },
});

const loading = ref(false);
const allowToolTip = ref(false);
const chatSenderRef = ref(null);
const selectOptions = [
  {
    label: '默认模型',
    value: 'default',
  },
  {
    label: 'Deepseek',
    value: 'deepseek-r1',
  },
  {
    label: '混元',
    value: 'hunyuan',
  },
];
const selectValue = ref({
  label: '默认模型',
  value: 'default',
});
const isChecked = ref(false);
const checkClick = () => {
  isChecked.value = !isChecked.value;
};
// 模拟消息发送
function inputEnter(inputValue: string) {
  if (loading.value) {
    return;
  }
  if (!inputValue) return;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 5000);
}

function fileSelect(file: File) {
  console.log(file);
}
</script>
<style lang="less">
.chat-sender {
  .btn {
    color: var(--td-text-color-disabled);
    border: none;
    &:hover {
      color: var(--td-brand-color-hover);
      border: none;
      background: none;
    }
  }
  .btn.t-button {
    height: var(--td-comp-size-m);
    padding: 0;
  }
  .model-select {
    display: flex;
    align-items: center;
    .t-select {
      width: 112px;
      height: var(--td-comp-size-m);
      margin-right: var(--td-comp-margin-s);
      .t-input {
        border-radius: 32px;
        padding: 0 15px;
      }
      .t-input.t-is-focused {
        box-shadow: none;
      }
    }
    .check-box {
      width: 112px;
      height: var(--td-comp-size-m);
      border-radius: 32px;
      border: 0;
      background: var(--td-bg-color-component);
      color: var(--td-text-color-primary);
      box-sizing: border-box;
      flex: 0 0 auto;
      .t-button__text {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: var(--td-comp-margin-xs);
        }
      }
    }
    .check-box.is-active {
      border: 1px solid var(--td-brand-color-focus);
      background: var(--td-brand-color-light);
      color: var(--td-text-color-brand);
    }
  }
}
</style>
