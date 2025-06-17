import { SettingIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import { UserRoleEnum } from '@/constants';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/model',
    name: 'System',
    meta: {
      title: {
        zh_CN: '系统设置',
        en_US: 'Dashboard',
      },
      icon: shallowRef(SettingIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'model',
        name: 'SystemModel',
        component: () => import('@/pages/setting/model-config/index.vue'),
        meta: {
          title: {
            zh_CN: '模型配置',
          },
          // roleCodes: [],
        },
      },
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/pages/setting/user-manage/index.vue'),
        meta: {
          title: {
            zh_CN: '用户管理',
          },
        },
      },
      {
        path: 'database',
        name: 'SystemDatabase',
        component: () => import('@/pages/setting/data-base-config/index.vue'),
        meta: {
          title: {
            zh_CN: '数据库连接',
          },
        },
      },
      {
        path: 'theme',
        name: 'SystemTheme',
        component: () => import('@/pages/setting/theme-config/index.vue'),
        meta: {
          title: {
            zh_CN: '主题设置',
          },
        },
      },
    ],
  },
];
