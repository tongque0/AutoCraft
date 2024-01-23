// handlerHelpers.js
import { sendErrorResponse,sendSuccessResponse } from "../util/resp.js";
import { logger } from "../util/logger.js";
export async function handleServiceCall(serviceFunction, req, res) {
    try {
        const result = await serviceFunction(req);

        if (result && result.message && result.status) {
            // Service 层返回了自定义错误
            sendErrorResponse(res, result.status, result.message);
        } else {
            // Service 层返回了成功的结果
            sendSuccessResponse(res, 200, { data: result });

        }
    } catch (error) {
        // Service 层抛出了异常
        logger.error("Error:", error);
        sendErrorResponse(res, 500, "内部服务器错误");
    }
}
