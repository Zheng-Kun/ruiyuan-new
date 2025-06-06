// 前端 roles 控制菜单权限 通过登录后的角色对菜单就行过滤处理
// 如果需要前端 roles 控制菜单权限 请使用此文件代码替换 permission.ts 的内容

import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';

import router, { allRoutes } from '@/router';
import { store } from '@/store';
import { UserRoleEnum } from '@/constants'

function filterPermissionsRouters(routes: Array<RouteRecordRaw>, roles: Array<UserRoleEnum>) {
  const res: Array<RouteRecordRaw> = [];
  const removeRoutes: Array<RouteRecordRaw> = [];
  routes.forEach((route) => {
    const children: Array<RouteRecordRaw> = [];
    route.children?.forEach((childRouter) => {
      const roleCodes = childRouter.meta?.roleCodes as UserRoleEnum[];
      // console.log(roleCodes)
      if(!roleCodes || !roleCodes?.length || roles.filter((item) => roleCodes.includes(item)).length) {
        children.push(childRouter);
      } else {
        removeRoutes.push(childRouter);
      }
      // if (roles.indexOf(roleCode) !== -1) {
      // } else {
      // }
    });
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  // console.log('removeRoutes',removeRoutes)
  return { accessedRouters: res, removeRoutes };
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [] as any[],
    removeRoutes: [] as any[],
  }),
  actions: {
    async initRoutes(roles?: Array<UserRoleEnum>) {
      // const userStore = useUserStore();
      let accessedRouters = [];
      // roles = userStore.userInfo.roles;
      let removeRoutes: Array<RouteRecordRaw> = [];
      // special token
      if(!roles || roles.length === 0) {
        accessedRouters = allRoutes
      }
      /* if (roles.includes(UserRoleEnum.admin)) {
        accessedRouters = allRoutes;
      } */ else {
        const res = filterPermissionsRouters(allRoutes, roles);
        accessedRouters = res.accessedRouters;
        removeRoutes = res.removeRoutes;
      }

      this.routers = accessedRouters;
      this.removeRoutes = removeRoutes;

      removeRoutes.forEach((item: RouteRecordRaw) => {
        if (router.hasRoute(item.name)) {
          router.removeRoute(item.name);
        }
      });
    },
    async restore() {
      this.removeRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
