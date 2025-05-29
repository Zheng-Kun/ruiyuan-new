import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/test',
    component: Layout,
    redirect: '/test/base',
    name: 'test',
    meta: {
      title: {
        zh_CN: '组件测试',
        en_US: 'Dashboard',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 7,
    },
    children: [
      {
        path: 'base',
        name: 'TestBase',
        component: () => import('@/pages/test/chatSenderTest.vue'),
        meta: {
          title: {
            zh_CN: '输入组件测试',
            en_US: 'Overview',
          },
        },
      },
      {
        path: 'chat',
        name: 'TestChat',
        component: () => import('@/pages/test/chatTest.vue'),
        meta: {
          title: {
            zh_CN: 'chat组件测试',
            en_US: 'Overview',
          },
        },
      },
    ],
  },
];
