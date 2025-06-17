<template>
  <div class="user-manage-container">
    <div class="header">
      <div class="filter-container">
        <div class="filter-form">
          <t-input
            v-model="filterForm.username"
            placeholder="请输入用户名"
            label="用户名"
            clearable
            class="filter-item"
          />
          <t-select
            v-model="filterForm.role"
            label="角色"
            clearable
            class="filter-item"
            :options="userRoleOptions"
            placeholder="请选择角色"
          />
          <t-select
            v-model="filterForm.tag"
            label="标签"
            clearable
            class="filter-item"
            :options="tagOptions"
            placeholder="请选择标签"
          />
        </div>
        <div class="right-btn">
          <t-button variant="outline" theme="primary" class="search-btn" @click="handleSearchClick">
            <template #icon>
              <t-icon name="search" />
            </template>
            搜索
          </t-button>
        </div>
      </div>
      <div class="operate-container">
        <t-button variant="outline" theme="primary" class="add-btn" @click="handleAddUser">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加用户
        </t-button>
      </div>
    </div>
    <div class="table-container">
      <t-table
        :data="tableData.data"
        :columns="tableColumns"
        :loading="tableData.loading"
        :pagination="tableData.pagination"
        row-key="id"
      >
        <template #role="{ row }">
          <t-tag :theme="row.role === '0' ? 'primary' : row.role === '1' ? 'warning' : 'success'" size="small">
            {{ userRoleOptions.find((option) => option.value === row.role)?.label || '未知角色' }}
          </t-tag>
        </template>
        <template #operate="{ row }">
          <t-button variant="text" theme="primary" size="small" @click="editUser(row.id)"> 编辑 </t-button>
          <t-button variant="text" theme="danger" size="small" @click="resetPassword(row)"> 重置密码 </t-button>
          <t-popconfirm content="确定删除该用户吗？" @confirm="deleteUser(row.id)">
            <t-button variant="text" theme="danger" size="small"> 删除 </t-button>
          </t-popconfirm>
        </template>
        <template #status="{ row }">
          <t-switch
            v-model="row.status"
            :custom-value="[userStatusEnum.active, userStatusEnum.inactive]"
            :label="['启用', '禁用']"
            :loading="statusLoadingMap[row.id]"
            :before-change="() => handleChangeStatus(row)"
          />
          <!-- size="small" -->
        </template>
        <template #tags="{ row }">
          <div style="display: inline-block">
            <t-tag
              v-for="tag in row.tags.slice(0, 5)"
              :key="tag"
              theme="primary"
              variant="outline"
              size="small"
              style="margin-right: 4px"
            >
              {{ tag }}
            </t-tag>
            <t-popup
              v-if="row.tags.length > 5"
              trigger="click"
              placement="bottom"
              :overlay-style="{ padding: '12px 16px', maxWidth: '320px' }"
            >
              <t-link theme="primary" style="margin-left: 4px">更多</t-link>
              <template #content>
                <div>
                  <t-tag
                    v-for="tag in row.tags"
                    :key="tag"
                    variant="outline"
                    theme="primary"
                    size="small"
                    style="margin: 2px 6px 2px 0"
                  >
                    {{ tag }}
                  </t-tag>
                </div>
              </template>
            </t-popup>
          </div>
        </template>
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { onMounted, reactive, ref } from 'vue';

import { userRoleOptions } from '@/constants';

const tableData = reactive({
  data: [] as any[],
  loading: false,
  pagination: {
    defaultPageSize: 10,
    defaultCurrent: 1,
    total: 0,
  },
});

const defaultPageSize = 20;

const userStatusEnum = {
  active: '1',
  inactive: '0',
};

const defaultFilter = {
  username: '',
  email: '',
  role: '',
  tag: '',
};

const filterForm = reactive({
  ...defaultFilter,
});

const onSearchForm = reactive({
  ...defaultFilter,
});

// 1. 修改 tableColumns，增加序号列和描述列
type TableColumn = {
  colKey: string;
  title: string;
  align: 'center';
  width?: string | number;
  fixed?: 'left' | 'right';
};
const tagOptions = [
  { label: '前端', value: '前端' },
  { label: '后端', value: '后端' },
  { label: '产品', value: '产品' },
  { label: '测试', value: '测试' },
  { label: '运维', value: '运维' },
  { label: 'UI', value: 'UI' },
  { label: '大前端', value: '大前端' },
];

const tableColumns = ref<TableColumn[]>([
  { colKey: 'serial-number', title: '序号', width: 60, align: 'center' },
  { colKey: 'username', title: '用户名', width: 100, align: 'center' },
  { colKey: 'account', title: '账号', width: 100, align: 'center' },
  { colKey: 'status', title: '状态', width: 100, align: 'center' },
  // { colKey: 'email', title: '邮箱', width: 200, align: 'center' },
  { colKey: 'role', title: '角色', width: 100, align: 'center' },
  { colKey: 'tags', title: '标签', width: 220, align: 'center' },
  { colKey: 'desc', title: '描述', width: 220, align: 'center' },
  { colKey: 'operate', title: '操作', width: 200, align: 'center', fixed: 'right' }, // 固定操作列
]);

// 每个用户的 loading 状态，key 为 id
const statusLoadingMap = reactive<Record<string, boolean>>({});

// 模拟异步请求
function updateUserStatusApi(row: any) {
  // console.log('切换用户状态:', row);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve(true);
      } else {
        reject(new Error('切换失败'));
      }
    }, 1000);
  });
}

async function handleChangeStatus(row: any) {
  const nextStatus = row.status === userStatusEnum.active ? userStatusEnum.inactive : userStatusEnum.active;
  console.log('切换状态:', row, nextStatus);
  statusLoadingMap[row.id] = true;
  try {
    await updateUserStatusApi({ ...row, status: nextStatus });
    MessagePlugin.success('切换状态成功');
    return true; // resolve后才会切换
  } catch (e) {
    MessagePlugin.error('切换状态失败，请稍后重试');
    return false; // reject/false不会切换
  } finally {
    statusLoadingMap[row.id] = false;
  }
}

function handleSearchClick() {
  // 模拟搜索操作
  Object.assign(onSearchForm, filterForm);
  tableData.loading = true;
}

function initTableData() {
  // 初始化表格数据
  tableData.loading = false;
  // 初始化筛选数据与分页
  initFilter();
  getTableData();
}

function initFilter() {
  Object.assign(filterForm, defaultFilter);
  Object.assign(onSearchForm, defaultFilter);
  Object.assign(tableData.pagination, {
    defaultPageSize,
    defaultCurrent: 1,
    total: 0,
  });
}

function getTableData() {
  // 模拟获取表格数据，增加 id 字段、tags 字段和 desc 字段
  tableData.pagination.total = 3; // 模拟总数据量
  tableData.data = [
    {
      id: 1,
      username: 'user1',
      account: 'user1_account',
      email: 'user1@example.com',
      role: '0',
      status: userStatusEnum.active,
      tags: ['前端', 'Vue', 'React', 'TypeScript', 'UI', '大前端'],
      desc: '前端开发工程师，擅长Vue和React',
    },
    {
      id: 2,
      username: 'user2',
      account: 'user2_account',
      email: 'user2@example.com',
      role: '1',
      status: userStatusEnum.inactive,
      tags: ['后端', 'Java', 'Spring', '微服务'],
      desc: '后端开发，Java技术栈，微服务架构',
    },
    {
      id: 3,
      username: 'user3',
      account: 'user3_account',
      email: 'user3@example.com',
      role: '2',
      status: userStatusEnum.active,
      tags: ['产品', '需求', '文档', '沟通', '项目管理', '敏捷'],
      desc: '产品经理，负责需求和项目管理',
    },
  ];
}

function handleAddUser() {
  // 模拟添加用户操作
  console.log('添加用户操作');
}
function editUser(id: string) {
  console.log('编辑用户操作', id);
}

function resetPassword(id: string) {
  // 模拟重置密码操作
  console.log('重置密码操作', id);
}

function deleteUser(id: string) {
  // 模拟删除用户操作
  console.log('删除用户操作', id);
}

onMounted(() => {
  initTableData();
});
</script>

<style scoped lang="less">
.user-manage-container {
  padding: 20px;
  height: 100%;
  background-color: var(--td-bg-color-page);
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .filter-container {
      display: flex;
      align-items: center;
      .filter-form {
        display: flex;
        gap: 10px;
        .filter-item {
          width: 200px;
        }
      }
      .right-btn {
        margin-left: 20px;
      }
    }
    .operate-container {
      // 操作按钮区域
    }
  }
  .table-container {
    background-color: var(--td-bg-color-container);
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
