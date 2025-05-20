<template>
  <div>
    <t-card :class="['custom-card', { clickable: enableClick, selected: selected }]" @click="handleCardClick">
      <template #header>
        <div class="card-header">
          <h3>{{ info.title }}</h3>
          <div class="header-actions">
            <t-dropdown
              v-if="operates && operates.length > 0"
              :options="
                operates.map((op) => ({
                  content: op.name,
                  value: op.key,
                }))
              "
              @click="handleOperateClick"
            >
              <t-button variant="text" theme="primary" @click.stop>
                <more-icon />
              </t-button>
            </t-dropdown>
            <t-checkbox v-if="canSelect" v-model="selected" class="select-checkbox" @click.stop />
          </div>
        </div>
      </template>
      <div class="card-content">
        <div v-for="item in infoConfig" :key="item.key" class="card-info-item">
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ info[item.key] }}</span>
        </div>
      </div>
      <div class="desc">
        <span class="label">描述</span>
        <text-ellipsis :text="info.desc" title="描述"> </text-ellipsis>
      </div>
      <div v-if="info.tags && info.tags.length > 0" class="tag-container">
        <tags :tags="info.tags"></tags>
      </div>

      <!-- 悬停遮罩 -->
      <div
        v-if="maskBtns && maskBtns.length > 0"
        class="mask"
        @mouseenter="showMask = true"
        @mouseleave="showMask = false"
        @click.stop
      >
        <div v-if="showMask" class="mask-content">
          <t-button v-for="btn in maskBtns" :key="btn.key" @click.stop="handleMaskBtnClick(btn.key)">
            <template v-if="btn.icon" #icon>
              <t-icon :name="btn.icon" />
            </template>
            {{ btn.name }}
          </t-button>
        </div>
      </div>
    </t-card>
  </div>
</template>
<script setup lang="ts">
import { MoreIcon } from 'tdesign-icons-vue-next';
import { computed, h, ref, withDefaults } from 'vue';

import Tags from '@/components/tag-list/index.vue';
import TextEllipsis from '@/components/text-ellipsis/index.vue';

const props = withDefaults(
  defineProps<{
    info: {
      title: string;
      id: number;
      desc: string;
      tags?: string[];
      [key: string]: any;
    };
    infoConfig: {
      label: string;
      key: string;
    }[];
    operates?: {
      name: string;
      key: string;
      icon?: string;
    }[];
    enableClick?: boolean;
    maskBtns?: {
      name: string;
      key: string;
      icon?: string;
    }[];
    canSelect?: boolean;
    selected?: boolean;
  }>(),
  {},
);
const emits = defineEmits(['update:selected', 'card-click', 'operate-click', 'mask-btn-click']);
const showMask = ref(false);

const selected = computed({
  set(val: boolean) {
    emits('update:selected', val);
  },
  get() {
    return props.selected;
  },
});

function handleCardClick() {
  if (props.enableClick) {
    emits('card-click', props.info.id);
    if (props.canSelect) {
      selected.value = !selected.value;
    }
  }
}
function handleOperateClick(value: any) {
  emits('operate-click', value.value, props.info.id);
}

function handleMaskBtnClick(key: string) {
  emits('mask-btn-click', key, props.info.id);
}
</script>

<style scoped lang="less">
@primary-color: var(--td-brand-color);
@hover-scale: 1.02;
@transition-duration: 0.2s;
// TODO mask 颜色需要根据主题变化
@mask-bg: rgba(0, 0, 0, 0.5);
@gap-size: 16px;

.custom-card {
  position: relative;
  transition: transform @transition-duration;
  overflow: hidden;

  &.clickable:hover {
    transform: scale(@hover-scale);
    cursor: pointer;
  }

  &.selected {
    border-color: @primary-color;
  }

  .card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-actions {
      display: flex;
      align-items: center;
      justify-items: flex-end;
    }

    .select-checkbox {
      margin-left: 6px;
    }
  }

  .card-content {
    .card-info-item {
      margin-bottom: 4px;
    }
  }
  .desc {
    margin-top: 20px;
  }
  .tag-container {
    margin-top: 8px;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: @mask-bg;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }

    .mask-content {
      display: flex;
      gap: @gap-size;
    }
  }
}
</style>
