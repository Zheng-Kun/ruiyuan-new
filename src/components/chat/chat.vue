<template>
  <div class="chat-container">
    <div class="chat-content">
      <chat-message :type="props.type" :session-id="props.activeChat" />
    </div>
  </div>
</template>
<script setup lang="ts">
import chatMessage from './chatMessage.vue';
import chatSender from './chatSender.vue';

const props = defineProps<{
  type: string;
  activeChat: number;
}>();
</script>

<style scoped lang="less">
.chat-container {
  height: 100%;
}
</style>
