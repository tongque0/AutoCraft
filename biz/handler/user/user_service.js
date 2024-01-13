import * as UserMethodService from '../../service/user/user.js'
import {sendErrorResponse,sendSuccessResponse} from '../../util/resp.js'

export async function RegisterMethod(req, res) {
    try {
        const result = await UserMethodService.CreateUser(req);
        sendSuccessResponse(res,200,result)
    } catch (error) {
        sendErrorResponse(res,500,error)
    }
}
export async function LoginMethod(req, res) {
    try {
        const result = await UserMethodService.LoginUser(req);
        sendSuccessResponse(res,200,result)
    } catch (error) {
        sendErrorResponse(res,500,error)
    }
}
export async function ChangePasswordMethod(req, res) {
    try {
        const result = await UserMethodService.ChangePassword(req);
        sendSuccessResponse(res,200,result)
    } catch (error) {
        sendErrorResponse(res,500,error)
    }
}

export async function UpdateUserMethod(req, res) {
    try {
        const result = await UserMethodService.UpdateUserProfile(req);
        sendSuccessResponse(res,200,result)
    } catch (error) {
        sendErrorResponse(res,500,error)
    }
}
