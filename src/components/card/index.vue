<template>
  <div>
    <t-card :class="['custom-card', { clickable: enableClick, selected: selected }]" @click="handleCardClick">
      <template #header>
        <div class="card-header">
          <!-- 新增 title-status 插槽 -->
          <div class="header-title">
            <h3>{{ info.title }}</h3>
            <div class="title-status">
              <slot name="title-status"></slot>
            </div>
          </div>
          <div class="header-actions">
            <!-- <t-dropdown
              v-if="operates && operates.length > 1"
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
            </t-dropdown> -->
            <t-dropdown
              v-if="operates && operates.length > 1"
              class="operate-dropdown"
              trigger="hover"
              @click="handleOperateClick"
            >
              <t-button variant="text" theme="primary" @click.stop>
                <more-icon />
              </t-button>
              <t-dropdown-menu class="dropdown-menu">
                <t-dropdown-item v-for="op in operates" :key="op.key" :value="op.key">
                  <!-- @click.stop="handleOperateClick({ value: op.key })" -->
                  <!-- <template v-if="op.icon" #icon> -->
                  <span class="dropdown-item-content" :class="op.theme || 'primary'">
                    <t-icon v-if="op.icon" :name="op.icon" />
                    {{ op.name }}
                  </span>
                  <!-- </template> -->
                  <!-- <t-button
                    variant="text"
                    :theme="op.theme || 'primary'"
                    size="small"
                    @click.stop="handleOperateClick({ value: op.key })"
                  >
                    {{ op.name }}
                    <template v-if="op.icon" #icon>
                      <t-icon :name="op.icon" />
                    </template>
                  </t-button> -->
                </t-dropdown-item>
              </t-dropdown-menu>
            </t-dropdown>
            <t-button
              v-else-if="operates && operates.length === 1"
              variant="text"
              :theme="operates[0].theme || 'primary'"
              size="small"
              @click.stop="handleOperateClick({ value: operates[0].key })"
            >
              <template v-if="operates[0].icon" #icon>
                <t-icon v-if="operates[0].icon" :name="operates[0].icon" />
              </template>
              {{ operates[0].name }}
            </t-button>
            <t-checkbox v-if="canSelect" v-model="selected" class="select-checkbox" @click.stop />
          </div>
        </div>
      </template>
      <div v-if="infoConfig.length > 0" class="card-content">
        <div v-for="item in infoConfig" :key="item.key" class="card-info-item">
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ info[item.key] }}</span>
        </div>
      </div>
      <div v-if="info.desc" class="desc">
        <!-- <span class="label">描述</span> -->
        <text-ellipsis class="desc-text" :text="info.desc" title="描述"> </text-ellipsis>
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
import { computed, ref, withDefaults } from 'vue';

import Tags from '@/components/tag-list/index.vue';
import TextEllipsis from '@/components/text-ellipsis/index.vue';

const props = withDefaults(
  defineProps<{
    info: {
      title: string;
      id: number;
      desc?: string;
      tags?: string[];
      [key: string]: any;
    };
    infoConfig?: {
      label: string;
      key: string;
    }[];
    operates?: {
      name: string;
      key: string;
      icon?: string;
      theme?: 'primary' | 'danger' | 'default';
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
  {
    canSelect: false,
    infoConfig: () => [],
    operates: () => [],
    enableClick: false,
    maskBtns: () => [],
    selected: false,
  },
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
@hover-scale: 1.07;
@transition-duration: 0.2s;
// TODO mask 颜色需要根据主题变化
@mask-bg: rgba(0, 0, 0, 0.5);
@gap-size: 16px;

.custom-card {
  position: relative;
  transition: transform @transition-duration;
  overflow: hidden;
  box-shadow: 0 0 0;

  &.clickable:hover {
    transform: scale(@hover-scale);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all ease-in-out @transition-duration;
  }

  &.selected {
    border-color: @primary-color;
  }

  .card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .header-title {
      display: flex;
      // align-items: center;
      flex-direction: column;
      // justify-content: start;
      h3 {
        margin: 0;
        font-size: 16px;
        color: var(--td-text-color-primary);
      }
      .title-status {
        margin-top: 8px;
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      justify-items: flex-end;
      .operate-dropdown {
      }
    }

    .select-checkbox {
      margin-left: 6px;
    }
  }

  :deep(.t-card__body) {
    padding-top: 0;
  }

  .card-content {
    margin-bottom: 20px;
    .card-info-item {
      margin-bottom: 4px;
    }
  }
  :deep(.desc-text) {
    color: var(--td-text-color-placeholder);
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
.dropdown-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  &.danger {
    color: var(--td-error-color);
  }
  &.primary {
    color: var(--td-brand-color);
  }
}
</style>
