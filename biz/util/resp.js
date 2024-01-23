import { validationResult, check } from 'express-validator';

// 发送错误响应
export function sendErrorResponse(res, code, message) {
    res.status(code).json({ message });
}

// 发送成功响应
export function sendSuccessResponse(res, code, data) {
    res.status(code).json(data);
}

// 通用的参数验证函数
export function validateParams(req, res, validations) {
    validations.forEach(validation => validation.run(req));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        sendErrorResponse(res, 400, errors.array());
        return false;
    }

    return true;
}
