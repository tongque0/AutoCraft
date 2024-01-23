
import { handleServiceCall } from '../handlerHelpers.js';
import { GetRouters } from '../../service/admin/admin.js';
export async function GetRouterMethod(req, res) {

    await handleServiceCall(GetRouters, req, res);
}

