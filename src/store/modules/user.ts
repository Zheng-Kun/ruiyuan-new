import { defineStore } from 'pinia';

import UserApi from '@/api/user';
import { UserRoleEnum } from '@/constants';
import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  username: '', // 用户名，用于展示在页面右上角头像处
  roles: [] as string[], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    // token: 'main_token', // 默认token不走权限
    token: '', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: { username: string; password: string }) {
      const data = await UserApi.login(userInfo);
      this.token = data;
      // console.log("登录成功", this.token);
    },
    async getUserInfo() {
      await UserApi.getUserInfo().then((data) => {
        // console.log('userInfo',data);
        this.userInfo = {
          ...data,
          username: data.username,
          roles: data.role.map((item: { roleId: number; roleName: string }) => item.roleId),
        };
      });
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes(this.userInfo.roles as UserRoleEnum[]);
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
      await UserApi.logout();
    },
  },
  persist: {
    afterRestore: (context) => {
      // console.log('afterRestore', context.store.userInfo);
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes(context.store.userInfo.roles);
    },
    key: 'user',
    paths: ['token'],
  },
});
