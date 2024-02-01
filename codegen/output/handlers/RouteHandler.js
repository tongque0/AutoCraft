// 引入对应的服务层
import * as RouteService from '../../service/route/route.js';
import { handleServiceCall } from '../handlerHelpers.js';

// 根据模型生成的各种方法
export async function CreateRouteMethod(req, res) {
    await handleServiceCall(RouteService.CreateRoute, req, res);
}

export async function GetAllRoutesSimpleMethod(req, res) {
    await handleServiceCall(RouteService.GetAllRoutesSimple, req, res);
}

export async function GetAllRoutesMethod(req, res) {
    await handleServiceCall(RouteService.GetAllRoutes, req, res);
}

export async function GetRouteByIdMethod(req, res) {
    await handleServiceCall(RouteService.GetRouteById, req, res);
}

export async function UpdateRouteMethod(req, res) {
    await handleServiceCall(RouteService.UpdateRoute, req, res);
}

export async function DeleteRouteMethod(req, res) {
    await handleServiceCall(RouteService.DeleteRoute, req, res);
}
