<template>
  <div class="chat-list-wrapper">
    <template v-for="[key, value] in Object.entries(chatGroupList)" :key="key">
      <div v-if="value?.length" class="group-wrapper">
        <div class="group-title">{{ groupKeyMap.get(key)?.name || '置顶' }}</div>
        <ul class="chat-list">
          <chat-item
            v-for="item in value"
            :key="item.id"
            class="chat-item"
            :active="item.id === activeId"
            :title="item.title"
            :pinned="item.pinned"
            @delete="handleDeleteItem(item.id)"
            @edit="handleEditItem(item)"
            @pin="handlePinItem(item)"
            @click="activeId = item.id"
          ></chat-item>
        </ul>
      </div>
    </template>
    <t-dialog v-model:visible="editTitleData.dialogVisible" header="编辑对话标题" @confirm="handleEditConfirm">
      <t-input v-model="editTitleData.title" placeholder="请输入新的对话标题" @enter="handleEditConfirm" />
    </t-dialog>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { computed, onMounted, reactive, ref } from 'vue';

import chatApi from '@/api/chat';

import chatItem from './chatTitleItem.vue';

dayjs.extend(customParseFormat);

onMounted(() => {
  getChatList();
});

interface ChatItem {
  title: string;
  id: number;
  time: string;
  pinned?: boolean;
}

const props = defineProps<{
  type: string;
  activeId: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeId', id: number): void;
  (e: 'edit', id: number, title: string): void;
  (e: 'delete', id: number): void;
}>();

const activeId = computed({
  get: () => props.activeId,
  set: (id) => emit('update:activeId', id),
});

const loading = ref(false);

const chatList = ref<any[]>([]);

const groupKeyMap = new Map([
  [
    'today',
    {
      name: '今天',
      range: [0, 0],
    },
  ],
  [
    'past7day',
    {
      name: '近7天',
      range: [1, 7],
    },
  ],
  [
    'past30day',
    {
      name: '近30天',
      range: [7, 30],
    },
  ],
  [
    'pastHalfYear',
    {
      name: '近半年',
      range: [31, 183],
    },
  ],
  [
    'pastYear',
    {
      name: '近一年',
      range: [184, 366],
    },
  ],
  [
    'earlier',
    {
      name: '更早',
      range: [367, Infinity],
    },
  ],
]);
const chatGroupList = computed<{
  [key: string]: ChatItem[];
}>(() => {
  const result = {
    pinnedList: chatList.value.filter((item) => item.pinned),
  } as any;
  const now = dayjs(); // 当前时间

  // 初始化结果对象
  for (const key of groupKeyMap.keys()) {
    result[key] = [];
  }

  for (const item of chatList.value.filter((item) => !item.pinned)) {
    // console.log('item', item.time);
    const date = dayjs(item.time, 'YYYY-MM-DD HH:mm:ss');

    // 忽略时间部分，只保留日期：例如 2025-05-28T10:30:00 → 2025-05-28T00:00:00
    const diffInDays = now.diff(date, 'day'); // 精确到“天”的差异，不考虑小时、分钟等
    // console.log(diffInDays);

    let matched = false;
    for (const [key, config] of groupKeyMap.entries()) {
      const [min, max] = config.range;

      if (diffInDays >= min && diffInDays <= max) {
        result[key].push(item);
        matched = true;
        break;
      }
    }

    if (!matched) {
      console.error('No matching group found for date:', date);
    }
  }

  return result;
});

const editTitleData = reactive({
  id: 0,
  dialogVisible: false,
  title: '',
});

function handleDeleteItem(id: number) {
  // 后端删除
  const deleteConfirm = DialogPlugin({
    header: '删除会话',
    theme: 'warning',
    body: '确定删除该会话？',
    confirmBtn: {
      theme: 'danger',
      content: '删除',
    },
    cancelBtn: {
      content: '取消',
    },
    dialogClassName: 'delete-dialog-confirm',
    onConfirm: async () => {
      // emit('delete', id);
      await deleteItem(id);
      deleteConfirm.hide();
    },
    onCancel: () => {
      deleteConfirm.hide();
    },
  });
}

function deleteItem(id: number) {
  chatList.value.splice(
    chatList.value.findIndex((i) => i.id === id),
    1,
  );
  /* return chatApi.deleteSession(id, props.type).then(() => {
    chatList.value.splice(
      chatList.value.findIndex((i) => i.id === id),
      1,
    );
    if (id === activeId.value) {
      activeId.value = 0;
    }
  }); */
}

function handleEditItem(item: ChatItem) {
  // emit('edit', item.id, item.title);
  Object.assign(editTitleData, {
    id: item.id,
    dialogVisible: true,
    title: item.title,
  });
}

function handleEditConfirm() {
  if (!editTitleData.title.trim().length) {
    MessagePlugin.error('标题不能为空');
    return;
  }
  chatList.value.find((i) => i.id === editTitleData.id).title = editTitleData.title;
  Object.assign(editTitleData, {
    id: 0,
    dialogVisible: false,
    title: '',
  });
}

/**
 * @description: 置顶
 * @param {*} item
 * @return {*}
 */
function handlePinItem(item: ChatItem) {
  item.pinned = !item.pinned;
  // todo
  /* chatApi
    .pinSession(
      {
        id: item.id,
        pinned: !item.pinned,
      },
      props.type,
    )
    .then(() => {
      item.pinned = !item.pinned;
    }); */
}

function getChatList() {
  loading.value = true;
  chatApi.getSessionList(props.type).then((res: any) => {
    chatList.value = res.data;
  });
}
</script>

<style scoped lang="less">
.chat-list-wrapper {
  // width: 100%;
  // height: 100%;
  // overflow-y: auto;
  padding: 10px;
  padding-left: 24px;

  .group-wrapper {
    margin-bottom: 20px;
    padding-left: 10px;

    .group-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--td-text-color-disabled);
      position: sticky;
      top: 40px;
      background-color: var(--td-bg-color-page);
    }

    .chat-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .chat-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
