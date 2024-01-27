import type { MenuListResult } from '@/api/model/permissionModel';
import { request } from '@/utils/request';

const Api = {
  MenuList: '/get-router',
};

export function getMenuList() {
  return request.get<MenuListResult>({
    url: Api.MenuList,
  });
}
