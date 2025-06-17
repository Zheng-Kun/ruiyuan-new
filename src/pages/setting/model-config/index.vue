<template>
  <div class="model-config-container">
    <div class="token-info">
      剩余Token：<span class="token-num">{{ tokenCount }}</span>
      <t-tag v-if="!isPro" theme="warning" size="small" style="margin-left: 16px">普通账号</t-tag>
      <t-tag v-else theme="success" size="small" style="margin-left: 16px">PRO账号</t-tag>
    </div>
    <t-table :data="configList" :columns="columns" row-key="scene">
      <template #model="{ row }">
        <t-radio-group v-model="row.model" @change="onModelChange(row)">
          <t-radio v-for="item in modelOptions" :key="item.value" :value="item.value" :disabled="item.pro && !isPro">
            {{ item.label }}
            <span v-if="item.type === 'local'" class="local-tag">本地</span>
            <span v-if="item.type === 'remote'" class="remote-tag">远程</span>
            <span v-if="item.pro" class="pro-tag">PRO</span>
          </t-radio>
        </t-radio-group>
      </template>
    </t-table>
    <div class="actions">
      <t-button theme="primary" @click="saveConfig">保存配置</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

// 假设这些数据来自接口
const tokenCount = ref(12345); // 剩余token数量
const isPro = ref(false); // 是否为pro账号

const modelOptions = [
  { label: '通用大模型A', value: 'modelA', type: 'local' },
  { label: '通用大模型B', value: 'modelB', type: 'local' },
  { label: '通用大模型B远程', value: 'modelB1', type: 'remote' },
  { label: '行业大模型C', value: 'modelC', pro: true, type: 'remote' },
  { label: '超大模型D', value: 'modelD', pro: true, type: 'remote' },
];

const configList = ref([
  { scene: '智擎对话', desc: '代码自动生成', model: 'modelA' },
  { scene: '智问', desc: '知识库检索', model: 'modelB' },
  { scene: '提示词优化', desc: '在智擎中做提示词优化', model: 'modelA' },
  { scene: '决策辅助', desc: '根据数据分析结果生成决策辅助内容', model: 'modelA' },
]);

const columns = [
  { colKey: 'scene', title: '业务场景', width: 120 },
  { colKey: 'desc', title: '说明', width: 200 },
  { colKey: 'model', title: '大模型', cell: 'model' },
];

function onModelChange(row: any) {
  // 可做实时保存或校验
}

function saveConfig() {
  MessagePlugin.success('配置已保存');
  // 可将 configList.value 发送到后端
}
</script>

<style scoped lang="less">
.model-config-container {
  padding: 24px;
  .token-info {
    margin-bottom: 20px;
    font-size: 16px;
    .token-num {
      color: #0052d9;
      font-weight: bold;
      font-size: 18px;
      margin: 0 4px;
    }
  }
  .actions {
    margin-top: 24px;
    text-align: right;
  }
  .pro-tag {
    background: linear-gradient(90deg, #a259ff 0%, #6a82fb 100%);
    color: #fff !important;
    border: none !important;
    font-weight: bold;
    box-shadow: 0 2px 8px 0 rgba(162, 89, 255, 0.15);
    letter-spacing: 1px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 8px;
    cursor: pointer;
  }
  .local-tag {
    background: #e0eaff;
    color: #0052d9;
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    font-weight: 500;
  }
  .remote-tag {
    background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
    color: #b15b00;
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 6px;
    margin-left: 8px;
    font-weight: 500;
  }
}
</style>
