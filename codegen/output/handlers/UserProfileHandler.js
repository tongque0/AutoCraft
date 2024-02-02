// 引入对应的服务层
import * as UserProfileService from '../../service/userprofile/userprofile_service.js';
import { handleServiceCall } from '../handlerHelpers.js';

// 根据模型生成的各种方法
export async function CreateUserProfileMethod(req, res) {
    await handleServiceCall(UserProfileService.CreateUserProfile, req, res);
}

export async function GetAllUserProfilesSimpleMethod(req, res) {
    await handleServiceCall(UserProfileService.GetAllUserProfilesSimple, req, res);
}

export async function GetAllUserProfilesMethod(req, res) {
    await handleServiceCall(UserProfileService.GetAllUserProfiles, req, res);
}

export async function GetUserProfileByIdMethod(req, res) {
    await handleServiceCall(UserProfileService.GetUserProfileById, req, res);
}

export async function UpdateUserProfileMethod(req, res) {
    await handleServiceCall(UserProfileService.UpdateUserProfile, req, res);
}

export async function DeleteUserProfileMethod(req, res) {
    await handleServiceCall(UserProfileService.DeleteUserProfile, req, res);
}
