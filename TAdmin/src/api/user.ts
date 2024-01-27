
import { request } from '@/utils/request';

const Api = {
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
export function Register(phone:String,account: String, password: String) {
    return request.post<any>({
        url: Api.Register,
        data:{
            email:account,
            password:password,
            profile:{
                phone:phone
            }
        }
    });
}

export function GetUserList(){
    return request.get<any>({
        url:Api.UserList
    })
}
