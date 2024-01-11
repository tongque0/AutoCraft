import * as UserMethodService from '../../service/user/user.js'

export async function RegisterMethod(req, res) {
    try {
        const result = await UserMethodService.CreateUser(req);
        console.log("User Created:", result);
        res.send(result);
    } catch (error) {
        console.error("Error in UserRegister:", error);
        res.status(500).send('Internal Server Error');
    }
}
export async function LoginMethod(req, res) {
    try {
        const result = await UserMethodService.LoginUser(req);
        console.log("User Login:", result);
        res.send(result);
    } catch (error) {
        console.error("Error in UserRegister:", error);
        res.status(500).send('Internal Server Error');
    }
}
export async function ChangePasswordMethod(req, res) {
    try {
        const result = await UserMethodService.ChangePassword(req);
        console.log("Changpassword:", result);
        res.send(result);
    } catch (error) {
        console.error("Error in UserRegister:", error);
        res.status(500).send('Internal Server Error');
    }
}
