<template>
  <t-popup :disabled="!isOverflowed" trigger="hover" overlay-class-name="popup-text-box">
    <template #content>
      <div class="popup-text-box">
        <div class="popup-text-box-title">
          {{ props.title }}
        </div>
        {{ props.text }}
      </div>
    </template>
    <div ref="textContainer" class="text-container" :class="`${isOverflowed ? 'is-over-flowed' : ''}`">
      {{ props.text }}
    </div>
  </t-popup>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  lineCount: {
    type: Number,
    default: 3,
  },
  title: {
    type: String,
    default: '概述',
  },
});

const textContainer = ref<HTMLElement | null>(null);
const isOverflowed = ref(false);

const lineHeight = ref(0);
const boxHeight = computed(() => {
  return `${lineHeight.value * props.lineCount}px`;
});

function checkOverflow() {
  const container = textContainer.value;
  if (!container) return;

  lineHeight.value = parseFloat(getComputedStyle(container).lineHeight);
  const maxAllowedHeight = lineHeight.value * props.lineCount;

  isOverflowed.value = container.scrollHeight > maxAllowedHeight;
}

onMounted(() => {
  checkOverflow();
});

watch(
  () => props.text,
  () => {
    checkOverflow();
  },
);
</script>

<style scoped lang="less">
.text-container {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  height: v-bind(boxHeight);
  line-clamp: v-bind(lineCount);
  -webkit-line-clamp: v-bind(lineCount);
  -webkit-box-orient: vertical;
}

.is-over-flowed {
  cursor: pointer;
}
</style>
<style lang="less">
.popup-text-box {
  padding: 10px;
  max-width: 400px;

  .popup-text-box-title {
    border-left: 2px solid var(--td-brand-color);
    padding-left: 16px;
    margin-bottom: 16px;
  }
}
</style>
