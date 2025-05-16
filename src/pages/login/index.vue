<template>
  <div class="login-wrapper">
    <div class="bg-container">
      <login-header />

      <div class="login-container">
        <div class="title-container">
          <!-- <h1 class="title margin-no">{{ t('pages.login.loginTitle') }}</h1> -->
          <!-- <h1 class="title">瑞元·数智管理平台</h1> -->
          <div class="slogan">
            <h2 ref="typeitElement"></h2>
          </div>
        </div>

        <login v-if="type === 'login'" />
        <register v-else @register-success="switchType('login')" />
      </div>

      <!-- <footer class="copyright">Copyright @ 2021-2023 . All Rights Reserved</footer> -->
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import TypeIt from 'typeit';
import { onMounted, ref } from 'vue';

import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

const type = ref('login');
const typeitElement = ref<HTMLElement | null>(null);
const switchType = (val: string) => {
  type.value = val;
};

onMounted(() => {
  new TypeIt(typeitElement.value, {
    strings: ['当经验沉淀为智慧，未来已然可见'], // 要显示的文字
    speed: 200, // 打字速度（单位：毫秒）
    loop: false, // 是否循环
    breakLines: false, // 是否允许换行
  }).go(); // 启动动画
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
