import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js'
//因为使用了prisma，model层代码可以简化省略

// 创建用户
export async function CreateUser(req) {
    const { email, password } = req.body;
    const hashPassword = await util.encryptPassword(password)
    try {
        const user = await prisma.user.create({
            data: {
                email, // 对象字面量属性值简写
                hashPassword // 保持字段命名一致
            }
        });
        console.log("Created User:", user);
        return user;
    } catch (error) {
        console.error("Error in CreateUser:", error);
        throw new Error('Error creating user'); // 抛出自定义错误信息
    }
}

// 用户登录
export async function LoginUser(req) {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email } // 对象字面量属性值简写
        });

        if (!user) {
            return { error: "用户不存在" }; // 明确用户不存在的情况
        }
        const authLogin = await util.validatePassword(password, user.hashPassword)
        user.token = util.generateToken(user)
        if (authLogin) {
            return user;
        } else {
            return { error: "密码错误" }; // 明确密码错误的情况
        }
    } catch (error) {
        console.error("Error in LoginUser:", error);
        return { error: '登录过程中发生错误' }; // 优化错误处理
    }
}
// 修改密码
export async function ChangePassword(req) {
    const { oldPassword, newPassword } = req.body;
    const { userId }  = req.user
    try {
        // 获取当前用户的信息
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { error: "用户不存在" };
        }

        // 验证旧密码
        const isValidPassword = await util.validatePassword(oldPassword, user.hashPassword);
        if (!isValidPassword) {
            return { error: "旧密码不正确" };
        }

        // 加密新密码
        const hashNewPassword = await util.encryptPassword(newPassword);

        // 更新密码
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { hashPassword: hashNewPassword }
        });

        console.log("Password changed for user:", updatedUser);
        return { message: "密码已更新" };
    } catch (error) {
        console.error("Error in ChangePassword:", error);
        return { error: '修改密码过程中发生错误' };
    }
}
