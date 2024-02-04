// 引入对应的服务层
import * as UserService from '../../service/user/user_service.js';
import { handleServiceCall } from '../handlerHelpers.js';

// 根据模型生成的各种方法
export async function CreateUserMethod(req, res) {
    await handleServiceCall(UserService.CreateUser, req, res);
}

export async function GetAllUsersSimpleMethod(req, res) {
    await handleServiceCall(UserService.GetAllUsersSimple, req, res);
}

export async function GetAllUsersMethod(req, res) {
    await handleServiceCall(UserService.GetAllUsers, req, res);
}

export async function GetUserByIdMethod(req, res) {
    await handleServiceCall(UserService.GetUserById, req, res);
}

export async function GetUserByMultipleFields(req, res) {
    await handleServiceCall(UserService.GetUserByMultipleFields, req, res);
}

export async function UpdateUserMethod(req, res) {
    await handleServiceCall(UserService.UpdateUser, req, res);
}

export async function DeleteUserMethod(req, res) {
    await handleServiceCall(UserService.DeleteUser, req, res);
}
