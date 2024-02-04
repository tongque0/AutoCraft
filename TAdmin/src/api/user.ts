
import { request } from '@/utils/request';

const Api = {
    user:'/user/',
    Login: '/user/login',
    Register: '/user/reg',
    UserList:'/user/list'
};

export function Login(account: String, password: String) {
    return request.post<any>({
        url: Api.Login,
        data:{
            email:account,
            password:password
        }
    });
}
export function Register(phone: String, account: String, password: String, ...additionalParams: any[]) {
    const additionalData = additionalParams.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    return request.post<any>({
        url: Api.Register,
        data: {
            email: account,
            password: password,
            profile: {
                phone: phone,
                ...additionalData
            }
        }
    });
}

export function GetUserList(){
    return request.get<any>({
        url:Api.UserList
    })
}
export function DeleteUser(id: any){
    return request.delete<any>({
        url:`${Api.user}${id}`
    })
}
