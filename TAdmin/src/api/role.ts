import { request } from '@/utils/request';

const Api = {
    Role:'/role/',
    RoleList:'/role/allsimple',
    Roleable:'/role/get-roleable',
    RoleRoutes:'/role/route'
};

export function GetRoleList(){
    return request.get<any>({
        url:Api.RoleList
    })
}
export function GetRoleable(name:string=''){
    return request.get<any>({
        url:`${Api.Roleable}?name=${name}`
    })
}
export function DeleteRoleable(id:number){
    return request.delete<any>({
        url:`${Api.Role}${id}`
    })
}
export function CreateRoleRoutes(role:any,routes:any[],b: string) {
    return request.post<any>({
        url: Api.RoleRoutes,
        data:{
            role,
            routeslevel:routes,
            status:b
        }
    });
}
