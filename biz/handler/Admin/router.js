
import { handleServiceCall } from '../handlerHelpers.js';
import { GetRouters, GetRouterTree } from '../../service/admin/adminroutes.js';
export async function GetRouterMethod(req, res) {

    await handleServiceCall(GetRouters, req, res);

}

export async function GetRouterTreeMethod(req, res) {

    await handleServiceCall(GetRouterTree, req, res);
}
