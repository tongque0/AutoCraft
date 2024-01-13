import { verifyToken } from '../util/auth.js'
import { sendSuccessResponse, sendErrorResponse } from '../util/resp.js';
export function authMiddleware(req, res, next) {
    // 允许登录和注册路由不经过身份验证
    if (req.path === '/user/login' || req.path === '/user/reg') {
        return next();
    }

    // 获取 Authorization 头部的内容
    const authHeader = req.headers.authorization;

    // 检查 Authorization 头部是否存在
    if (!authHeader) {
        return sendErrorResponse(res, 401, { error: '未提供认证令牌' })
    }

    // 分割 'Bearer' 和令牌
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return sendErrorResponse(res, 401, { error: '令牌格式错误,正确格式为 "Bearer <token>" ' })
    }

    const token = parts[1];

    try {
        // 验证并解析 JWT
        const decoded = verifyToken(token);

        // 将用户信息添加到请求对象
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        sendErrorResponse(res, 401, error)
    }
}
