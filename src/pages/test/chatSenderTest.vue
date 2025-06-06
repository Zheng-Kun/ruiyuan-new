<template>
  <div class="container">
    <h1>输入组件</h1>
    <!-- <chatSender v-model:value="value"></chatSender>
    <hr />
    {{ /\r?\n/.test(value) }}
    <pre>{{ value }}</pre>
    <t-chat-item
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      name="自己"
      role="user"
      datetime="今天16:38"
      :content="value"
      variant="outline"
    ></t-chat-item>
    <hr /> -->
    <chatSender v-model:value="value2" class="el-sender" />
    <pre>{{ value2 }}</pre>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import chatSender from '@/components/chat/chatSender.vue';
// import elSender from '@/components/chat/elSender.vue';

// const value = ref('');
const value2 = ref('');
</script>

<style scoped lang="less">
.container {
  height: 100%;
  background-color: var(--td-bg-color-container);
  overflow-y: auto;
  .el-sender {
    background-color: #fff;
  }
}
</style>
