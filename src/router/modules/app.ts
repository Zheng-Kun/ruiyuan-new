import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/engine',
    component: Layout,
    redirect: '/engine/app/list',
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
        path: 'app/list',
        name: 'EngineApp',
        component: () => import('@/pages/engine/app/index.vue'),
        meta: {
          title: {
            zh_CN: '应用管理',
          },
        },
      },
      {
        path: 'app/create',
        name: 'EngineAppCreate',
        component: () => import('@/pages/engine/app/editAgent.vue'),
        props: (route: any) => ({ mode: 'create', id: '0', ...route.params }),
        meta: {
          title: {
            zh_CN: '创建应用',
          },
        },
      },
      {
        path: 'app/edit/:id',
        name: 'EngineAppEdit',
        component: () => import('@/pages/engine/app/editAgent.vue'),
        props: (route: any) => ({ mode: 'edit', id: route.params.id, ...route.params }),
        // props: true,
        meta: {
          title: {
            zh_CN: '编辑应用',
          },
          hidden: true,
        },
      },
      /* {
        path: 'project',
        name: 'EngineProject',
        component: () => import('@/pages/engine/project/index.vue'),
        meta: {
          title: {
            zh_CN: '项目',
          },
        },
      }, */
      {
        path: 'data',
        name: 'EngineData',
        component: () => import('@/pages/engine/data/index.vue'),
        meta: {
          title: {
            zh_CN: '数据源',
          },
        },
        redirect: '/engine/data/list',
        children: [
          {
            path: 'list',
            name: 'DataSourceList',
            component: () => import('@/pages/engine/data/pages/dataSource.vue'),
            meta: {
              title: '数据源管理',
            },
          },
          {
            path: 'space',
            name: 'DataSpace',
            component: () => import('@/pages/engine/data/pages/dataSpace.vue'),
            meta: {
              title: '数据空间管理',
            },
          },
          {
            path: 'relation',
            name: 'DataRelation',
            component: () => import('@/pages/engine/data/pages/dataRelationshipMap.vue'),
            meta: {
              title: '数据关系网络',
            },
          },
        ],
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
