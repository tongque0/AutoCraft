import { defineStore } from 'pinia';

import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';
import { Login } from "@/api/user"
const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const account = userInfo.account as string; // 类型断言为string
      const password = userInfo.password as string; // 类型断言为string
      const data= await Login(account, password);
      if (data.token) {
        this.token = data.token;
      } else {
        throw data;
      }
    },
    async getUserInfo() {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'Tencent',
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token'],
  },
});
