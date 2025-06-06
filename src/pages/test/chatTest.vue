<template>
  <div>
    <h1>chat</h1>
    <chat type="test" :active-chat="1" />
  </div>
</template>
<script setup lang="ts">
import chat from '@/components/chat/chat.vue';
</script>

<style scoped lang="less"></style>
