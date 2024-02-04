// 引入对应的服务层
import * as RoleRouteService from '../../service/roleroute/roleroute_service.js';
import { handleServiceCall } from '../handlerHelpers.js';

// 根据模型生成的各种方法
export async function CreateRoleRouteMethod(req, res) {
    await handleServiceCall(RoleRouteService.CreateRoleRoute, req, res);
}

export async function GetAllRoleRoutesSimpleMethod(req, res) {
    await handleServiceCall(RoleRouteService.GetAllRoleRoutesSimple, req, res);
}

export async function GetAllRoleRoutesMethod(req, res) {
    await handleServiceCall(RoleRouteService.GetAllRoleRoutes, req, res);
}

export async function GetRoleRouteByIdMethod(req, res) {
    await handleServiceCall(RoleRouteService.GetRoleRouteById, req, res);
}

export async function GetRoleRouteByMultipleFields(req, res) {
    await handleServiceCall(RoleRouteService.GetRoleRouteByMultipleFields, req, res);
}

export async function UpdateRoleRouteMethod(req, res) {
    await handleServiceCall(RoleRouteService.UpdateRoleRoute, req, res);
}

export async function DeleteRoleRouteMethod(req, res) {
    await handleServiceCall(RoleRouteService.DeleteRoleRoute, req, res);
}
