<template>
  <li
    class="chat-item"
    :class="{
      active: active,
      pinned: pinned,
    }"
  >
    <div class="title"><pin-outline-icon v-if="pinned" class="title-pin-icon" width="16px" />{{ props.title }}</div>
    <div class="t-dropdown-container">
      <t-dropdown>
        <t-button theme="default" variant="text" shape="square"> <t-icon name="ellipsis" size="16" /></t-button>
        <t-dropdown-menu>
          <t-dropdown-item>
            <t-button variant="text" theme="default" size="small" @click.stop="() => emit('pin')">
              <template v-if="!pinned" #icon>
                <pin-outline-icon class="drop-down-icon" width="16px" />
              </template>
              <template v-else #icon>
                <pin-off-outline-icon class="drop-down-icon" width="16px" />
              </template>
              {{ pinned ? '取消置顶' : '置顶' }}
            </t-button>
          </t-dropdown-item>
          <t-dropdown-item>
            <t-button variant="text" theme="default" size="small" @click.stop="() => emit('edit')">
              <template #icon>
                <edit2-icon />
              </template>
              编辑
            </t-button>
          </t-dropdown-item>
          <t-dropdown-item>
            <t-button variant="text" theme="danger" size="small" @click.stop="() => emit('delete')">
              <template #icon>
                <delete1-icon />
              </template>
              删除
            </t-button>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </div>
  </li>
</template>
<script setup lang="ts">
import { Delete1Icon, Edit2Icon } from 'tdesign-icons-vue-next';
import { withDefaults } from 'vue';

import PinOffOutlineIcon from '@/assets/chat/PinOffOutline.svg';
import PinOutlineIcon from '@/assets/chat/PinOutline.svg?component';

const props = withDefaults(
  defineProps<{
    id?: number;
    title: string;
    pinned?: boolean;
    active?: boolean;
  }>(),
  {
    pinned: false,
    active: false,
  },
);

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
  (e: 'pin'): void;
  (e: 'active'): void;
}>();
</script>

<style scoped lang="less">
.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;

  &.active {
    background-color: #f0f0f0;
  }
  &.pinned {
    font-weight: bold;
  }
  &:hover {
    background-color: #e6e6e6;
  }

  .title {
    flex-grow: 1;
    font-size: 14px;
    color: var(--td-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .title-pin-icon {
      margin-right: 4px;
      vertical-align: middle;
    }
  }

  /* .t-dropdown {
    margin-left: auto;

    .t-button {
      padding: 0;
      min-width: unset;
    }
  } */
}
.drop-down-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
</style>
