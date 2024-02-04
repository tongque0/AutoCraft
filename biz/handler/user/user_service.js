import * as UserMethodService from '../../service/user/user.js'

import { handleServiceCall } from '../handlerHelpers.js';

export async function RegisterMethod(req, res) {
    await handleServiceCall(UserMethodService.CreateUser, req, res);
}
export async function LoginMethod(req, res) {
    await handleServiceCall(UserMethodService.LoginUser, req, res);
}
export async function ChangePasswordMethod(req, res) {
    await handleServiceCall(UserMethodService.ChangePassword, req, res);
}
export async function UpdateUserMethod(req, res) {
    await handleServiceCall(UserMethodService.UpdateUserProfile, req, res);
}
export async function GetAllUsersMethod(req, res) {
    await handleServiceCall(UserMethodService.GetAllUsers, req, res);
}
export async function DeleteUserByIdMethod(req, res) {
    await handleServiceCall(UserMethodService.DeleteUserById, req, res);
}
export async function GetUserByIdMethod(req, res) {
    await handleServiceCall(UserMethodService.GetUserById, req, res);
}
