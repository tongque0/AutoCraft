import { request } from '@/utils/request';

const Api = {
    RoleList:'/role/allsimple'
};

export function GetRoleList(){
    return request.get<any>({
        url:Api.RoleList
    })
}
