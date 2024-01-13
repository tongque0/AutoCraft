import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js'
import { logger } from "../../util/logger.js";
//因为使用了prisma，model层代码可以简化省略

// 创建用户
export async function CreateUser(req) {
    const { email, password, profile } = req.body;
    const hashPassword = await util.encryptPassword(password);

    try {
        let user = await prisma.user.findUnique({
            where: { email } // 对象字面量属性值简写
        });

        if (user) {
            return { error: "用户已存在" }; // 明确用户不存在的情况
        }
        // 使用事务同时创建用户和用户资料
        user = await prisma.$transaction(async prisma => {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    hashPassword,
                },
            });

            const userProfile = await prisma.userProfile.create({
                data: {
                    userId: newUser.userId.toString(),
                    name: profile?.name || '',
                    address: profile?.address || '',
                    phone: profile?.phone || '',
                },
            });

            return { ...newUser, profile: userProfile };
        });
        user.token = util.generateToken(user)
        return user;
    } catch (error) {
        logger.error("Error in CreateUser:", error);
        throw new error;
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
            delete user.hashPassword
            return user;
        } else {
            return { error: "密码错误" }; // 明确密码错误的情况
        }
    } catch (error) {
        logger.error("Error in LoginUser:", error);
        throw error;
    }
}

// 修改密码
export async function ChangePassword(req) {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.user
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
        delete updatedUser.hashPassword
        return updatedUser;
    } catch (error) {
        logger.error("Error in ChangePassword:", error);
        throw error;
    }
}

//更新用户信息
export async function UpdateUserProfile(req) {
    const { userId } = req.user;
    const { name, address, phone } = req.body;
    try {
        const userProfile = await prisma.userProfile.update({
            where: { userId: userId.toString() },
            data: { name, address, phone }
        });

        return userProfile;
    } catch (error) {
        logger.error("Error in UpdateUserProfile:", error);
        throw error;
    }
}
