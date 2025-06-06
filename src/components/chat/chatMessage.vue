<template>
  <div class="chat-message-container" :class="{ 'is-new-session': props.sessionId === 0 }">
    <div v-if="props.sessionId" class="session-title">{{ sessionName || '对话名称（详情获取）' }}</div>
    <Welcome
      v-if="props.sessionId === 0"
      variant="borderless"
      title="欢迎使用 小瑞助手"
      description="生成数据图表，获取决策建议"
    >
      <!-- :style="{ background: '#fff' }" -->

      <template #image> 🍊 </template>
    </Welcome>
    <BubbleList
      v-else
      :list="bubbleItems"
      :back-button-position="{
        bottom: '10px',
        left: 'calc(100% - 60px)',
      }"
      :btn-loading="false"
      btn-icon-size="20"
      max-height="2000px"
      btn-color="var(--td-brand-color)"
    >
      <!-- 自定义头像 -->
      <template #avatar="{ item }">
        <div class="avatar-wrapper">
          <template v-if="item.role === 'ai'">🍊</template>
          <template v-else>🧑‍💻</template>
        </div>
      </template>

      <!-- 自定义头部 -->
      <!-- <template #header="{ item }">
        <div class="header-wrapper">
          <div class="header-name">
            {{ item.role === 'ai' ? '🍊小瑞' : '🧁 用户' }}
          </div>
        </div>
      </template> -->

      <!-- 自定义气泡内容 -->
      <!-- <template #content="{ item }">
        <div class="content-wrapper">
          <div class="content-text">
          </div>
        </div>
      </template> -->

      <!-- 自定义底部 -->
      <template #footer="{ item }">
        <div class="footer-wrapper">
          <div class="footer-container">
            <!-- <el-button type="info" :icon="Refresh" size="small" circle />
            <el-button type="success" :icon="Search" size="small" circle />
            <el-button type="warning" :icon="Star" size="small" circle />
            <el-button color="#626aef" :icon="DocumentCopy" size="small" circle /> -->
            <t-button variant="outline" theme="default" size="small" shape="circle" @click="handleCopy(item)">
              <template #icon>
                <copy-icon />
              </template>
            </t-button>
          </div>
          <div class="footer-time">
            {{ item.role === 'ai' ? '下午 2:32' : '下午 2:33' }}
          </div>
        </div>
      </template>

      <!-- 自定义 loading -->
      <template #loading="{ item }">
        <div class="loading-container">
          <span>#{{ item.role }}-{{ item.key }}：</span>
        </div>
      </template>
    </BubbleList>
    <chat-sender class="sender" />
  </div>
</template>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import { CopyIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { BubbleListItemProps, BubbleListProps } from 'vue-element-plus-x/types/BubbleList';

import ChatSender from '@/components/chat/chatSender.vue';

const props = defineProps<{
  type: string;
  sessionId: number;
  sessionName?: string;
}>();

onMounted(() => {
  bubbleItems.value = generateFakeItems(7);
  console.log('sessionId', props.sessionId);
});

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

// 示例调用
const bubbleItems = ref<BubbleListProps<listType>['list']>([]);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    const content = role === 'ai' ? '💖'.repeat(5) : `真不错，我试试`;
    const loading = false;
    const shape = 'corner';
    const variant = role === 'ai' ? 'filled' : 'outlined';
    const isMarkdown = false;
    const typing = role === 'ai' ? i === count - 1 : false;
    const avatar = '';

    messages.push({
      key, // 唯一标识
      role, // user | ai 自行更据模型定义
      placement, // start | end 气泡位置
      content, // 消息内容 流式接受的时候，只需要改这个值即可
      loading, // 当前气泡的加载状态
      shape, // 气泡的形状
      variant, // 气泡的样式
      isMarkdown, // 是否渲染为 markdown
      typing, // 是否开启打字器效果 该属性不会和流式接受冲突
      isFog: role === 'ai', // 是否开启打字雾化效果，该效果 v1.1.6 新增，且在 typing 为 true 时生效，该效果会覆盖 typing 的 suffix 属性
      avatar,
      avatarSize: '24px', // 头像占位大小
      avatarGap: '12px', // 头像与气泡之间的距离
    });
  }
  return messages;
}

function handleCopy(item: any) {
  copy(item.content);
  MessagePlugin.success('内容已粘贴到剪贴板');
}
</script>

<style scoped lang="less">
.chat-message-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  .session-title {
    color: var(--td-text-color-placeholder);
  }
  &.is-new-session {
    justify-content: center;
    padding-bottom: 100px; // 将sender顶到center位置
  }
  :deep(.el-sender) {
    background-color: var(--td-bg-color-container);
  }
}
.avatar-wrapper {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: aliceblue;
  border-radius: 50%;
}

.header-wrapper {
  .header-name {
    font-size: 14px;
    color: #979797;
  }
}

.content-wrapper {
  .content-text {
    font-size: 14px;
    color: #333;
    padding: 12px;
    background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.footer-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  .footer-time {
    font-size: 12px;
    margin-top: 3px;
  }
}

.footer-container {
  :deep(.el-button + .el-button) {
    margin-left: 8px;
  }
}

.loading-container {
  font-size: 14px;
  color: #333;
  padding: 12px;
  background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container span {
  display: inline-block;
  margin-left: 8px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(5px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.loading-container span:nth-child(4n) {
  animation: bounce 1.2s ease infinite;
}
.loading-container span:nth-child(4n + 1) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.3s;
}
.loading-container span:nth-child(4n + 2) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.6s;
}
.loading-container span:nth-child(4n + 3) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.9s;
}
</style>
