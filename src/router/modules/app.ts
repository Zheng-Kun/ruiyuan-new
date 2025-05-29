import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/engine',
    component: Layout,
    redirect: '/engine/app',
    name: 'Engine',
    meta: {
      title: {
        zh_CN: '智擎',
        en_US: 'Dashboard',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
    },
    children: [
      {
        path: 'app',
        name: 'EngineApp',
        component: () => import('@/pages/engine/app/index.vue'),
        meta: {
          title: {
            zh_CN: '应用',
          },
        },
      },
      {
        path: 'app/edit',
        name: 'EngineAppEdit',
        component: () => import('@/pages/engine/app/editAgent.vue'),
        meta: {
          title: {
            zh_CN: '生成应用',
          },
        },
      },
      {
        path: 'project',
        name: 'EngineProject',
        component: () => import('@/pages/engine/project/index.vue'),
        meta: {
          title: {
            zh_CN: '项目',
          },
        },
      },
      {
        path: 'data',
        name: 'EngineData',
        component: () => import('@/pages/engine/data/index.vue'),
        meta: {
          title: {
            zh_CN: '数据源',
          },
        },
      },
      {
        path: 'template',
        name: 'EngineTemplate',
        component: () => import('@/pages/engine/template/index.vue'),
        meta: {
          title: {
            zh_CN: '分析模板',
          },
        },
      },
    ],
  },
];
