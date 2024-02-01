// 引入对应的服务层
import * as RoleService from '../../service/role/role.js';
import { handleServiceCall } from '../handlerHelpers.js';

// 根据模型生成的各种方法
export async function CreateRoleMethod(req, res) {
    await handleServiceCall(RoleService.CreateRole, req, res);
}

export async function GetAllRolesSimpleMethod(req, res) {
    await handleServiceCall(RoleService.GetAllRolesSimple, req, res);
}

export async function GetAllRolesMethod(req, res) {
    await handleServiceCall(RoleService.GetAllRoles, req, res);
}

export async function GetRoleByIdMethod(req, res) {
    await handleServiceCall(RoleService.GetRoleById, req, res);
}

export async function UpdateRoleMethod(req, res) {
    await handleServiceCall(RoleService.UpdateRole, req, res);
}

export async function DeleteRoleMethod(req, res) {
    await handleServiceCall(RoleService.DeleteRole, req, res);
}
