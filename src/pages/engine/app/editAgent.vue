<template>
  <div class="agent-generator-container">
    <div class="chat-side-bar" :class="{ 'left-side-close': !leftSideOpen }">
      <div class="header">
        <div class="chat-logo-container">
          <div v-if="leftSideOpen" class="name-container">
            <span class="logo-icon">🍊</span>
            <span class="logo-name">瑞元</span>
          </div>
          <div class="side-btn-box">
            <t-button variant="text" class="panel-btn" @click="leftSideOpen = !leftSideOpen">
              <template #icon>
                <dockToLeftOutlineIcon class="panel-icon default" height="20px" />
                <left-panel-close-outline-icon v-if="leftSideOpen" class="panel-icon close hover" height="20px" />
                <left-panel-open-outline-icon v-if="!leftSideOpen" class="panel-icon open hover" height="20px" />
              </template>
            </t-button>
          </div>
        </div>
        <div class="create-btn-container">
          <div class="create-btn">
            <div class="icon-container">
              <chat-plus-outline-icon />
            </div>
            <div v-if="leftSideOpen" class="text">新建对话</div>
          </div>
          <!-- <t-button theme="primary" variant="outline">新建对话</t-button> -->
        </div>
      </div>
      <div v-if="leftSideOpen" class="chat-history-container">
        <div class="his-header">
          <div class="his-logo">
            <chat-bubble-history-icon />
          </div>
          <div class="his-title">历史对话</div>
        </div>
        <chatGroupList v-model:active-id="activeChat" class="group-container" type="engine"></chatGroupList>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ChatBubbleHistoryIcon } from 'tdesign-icons-vue-next';
import { ref } from 'vue';
import type { ConversationItem, ConversationMenuCommand } from 'vue-element-plus-x/types/Conversations';

import ChatPlusOutlineIcon from '@/assets/chat/ChatPlusOutline.svg?component';
import dockToLeftOutlineIcon from '@/assets/chat/DockToLeftOutline.svg?component';
import LeftPanelCloseOutlineIcon from '@/assets/chat/LeftPanelCloseOutlineRounded.svg?component';
import LeftPanelOpenOutlineIcon from '@/assets/chat/LeftPanelOpenOutlineRounded.svg?component';
import chatGroupList from '@/components/chat/chatGroupList.vue';

const activeChat = ref(1);
const leftSideOpen = ref(true);

function handleMenuCommand(command: ConversationMenuCommand, item: ConversationItem) {
  console.log('内置菜单点击事件：', command, item);
  if (command === 'delete') {
    deleteChat(item);
  }
  if (command === 'rename') {
    editName(item);
  }
}

function editName(item: ConversationItem) {}

function deleteChat(item: ConversationItem) {}
</script>

<style scoped lang="less">
.agent-generator-container {
  height: 100%;
  width: 100%;
  .chat-side-bar {
    transition: all 0.3s ease-in-out;
    height: 100%;
    width: 300px;
    background-color: var(--td-bg-color-container);
    padding: 0 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    &.left-side-close {
      width: 60px;
      padding: 10px;
      transition: all 0.3s ease-in-out;
      .header {
        .chat-logo-container {
          justify-content: center;
        }
        .create-btn-container {
          .create-btn {
            height: 32px;
            width: 32px;
            flex: 0;
            flex-basis: 32px;
            justify-content: center;
            padding: 0;
            .icon-container {
              flex: 0;
              flex-basis: 24px;
            }
          }
        }
      }
    }
    .header {
      // position: sticky;
      // top: 0;
      padding: 16px 0 10px 0;
      // margin-bottom: 10px;
      background-color: var(--td-bg-color-container);
      z-index: 1;
      // border-bottom: 1px solid var(--td-brand-color-1);
      // box-shadow: 0 10px 10px var(--td-bg-color-container);
      .chat-logo-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding: 10px;
        .logo-icon {
          // font-size: 24px;
          // margin-right: 8px;
        }
        .logo-name {
          // font-size: 18px;
          font-weight: bold;
        }
      }
      .create-btn-container {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        .create-btn {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: start;
          cursor: pointer;
          padding: 6px 8px 6px 0;
          border-radius: 4px;
          height: 32px;
          &:hover {
            background-color: var(--td-brand-color-1);
            // border: 1px solid var(--td-brand-color-2);
          }
          .icon-container {
            // color: var(--td-brand-color);
            color: #fff;
            background-color: var(--td-brand-color);
            border-radius: 4px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
              width: 16px;
              height: 16px;
            }
          }
          .text {
            font-size: 14px;
            color: var(--td-brand-color);
            font-weight: bold;
            margin-left: 8px;
          }
        }
      }
    }
    .chat-history-container {
      flex: 1;
      // margin-top: 10px;
      overflow-y: auto;
      .his-header {
        display: flex;
        align-items: center;
        padding: 8px 0;
        position: sticky;
        top: 0;
        background-color: var(--td-bg-color-container);
        z-index: 1;

        .his-logo {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 16px;
            height: 16px;
          }
        }
        .his-title {
          font-size: 14px;
          font-weight: bold;
          margin-left: 8px;
        }
      }
    }
  }
}
.panel-btn {
  padding: 0;
  .panel-icon.hover {
    display: none;
  }
  &:hover {
    .panel-icon {
      &.default {
        display: none;
      }
      &.hover {
        display: inline-block;
      }
    }
  }
}
</style>
