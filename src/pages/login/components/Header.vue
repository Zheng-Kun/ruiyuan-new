<template>
  <header class="login-header">
    <div class="left-container">
      <img src="@/assets/logo/logo-br.png" alt="" class="logo" />
      <div class="title">瑞元·数智管理平台</div>
    </div>

    <div class="operations-container"></div>
  </header>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.login-header {
  padding: 0 var(--td-comp-paddingLR-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  // backdrop-filter: blur(10px);
  color: var(--td-text-color-primary);
  height: var(--td-comp-size-xxxl);
  .left-container {
    .logo {
      width: 178px;
      height: var(--td-comp-size-s);
      margin-right: 20px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    display: flex;
    align-items: center;
  }

  .operations-container {
    display: flex;
    align-items: center;

    .t-button {
      margin-left: var(--td-comp-margin-l);
    }
  }
}
</style>
