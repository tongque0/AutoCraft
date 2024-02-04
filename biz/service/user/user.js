import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js'
import * as helper from '../../util/helper.js'
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
            return { message: "用户已存在", status: 400 }; // 明确用户不存在的情况
        }
        const userdata = {
            email,
            hashPassword,
            phone:profile.phone,
            username:profile.username, // 如果 username 为 null，则使用默认值
        };

        // 使用事务同时创建用户和用户资料
        user = await prisma.$transaction(async prisma => {
            const newUser = await prisma.user.create({
                data:userdata,
            });

            const userProfile = await prisma.userProfile.create({
                data: {
                    userId: newUser.userId.toString(),
                },
            });

            return { ...newUser, profile: userProfile };
        });
        delete user.hashPassword
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
            return { message: "用户不存在", status: 404 }; // 明确用户不存在的情况
        }
        const authLogin = await util.validatePassword(password, user.hashPassword)
        user.token = util.generateToken(user)
        if (authLogin) {
            delete user.hashPassword
            return user;
        } else {
            return { message: "密码错误", status: 401 }; // 明确密码错误的情况
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
            where: { userId: userId }
        });

        if (!user) {
            return { message: "用户不存在", status: 404 };
        }

        // 验证旧密码
        const isValidPassword = await util.validatePassword(oldPassword, user.hashPassword);
        if (!isValidPassword) {
            return { message: "旧密码错误", status: 401 };
        }

        // 加密新密码
        const hashNewPassword = await util.encryptPassword(newPassword);

        // 更新密码
        const updatedUser = await prisma.user.update({
            where: { userId: userId },
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
        const updatedUserProfile = await prisma.userProfile.upsert({
            where: { userId: userId.toString() },
            update: { name, address, phone },
            create: {
                userId: userId.toString(),
                name,
                address,
                phone,
            },
        });

        return updatedUserProfile;
    } catch (error) {
        logger.error("Error in UpdateUserProfile:", error);
        throw error;
    }
}

// 获取所有用户
export async function GetAllUsers(req) {
    try {
        const users = await prisma.user.findMany({
        });

        // 解构每个用户对象，将 profile 信息移至顶层
        const modifiedUsers = users.map(user => {
            const { profile, ...otherDetails } = user;
            return { ...otherDetails, ...profile };
        });

        return modifiedUsers;
    } catch (error) {
        logger.error("Error in GetAllUsers:", error);
        throw error;
    }
}
export async function GetUserById(req) {
    try {
        // 假设用户的 ID 是通过请求参数传递的
        const userId = req.params.id;
        console.log(userId)
        // 使用 Prisma 查询指定 ID 的用户
        const user = await prisma.user.findUnique({
            where: {
                userId, // 确保这里的 userId 字段与您数据库中的字段名相匹配
            },
            include: {
                profile: true, // 如果您希望包括关联的 UserProfile 信息
            },
        });

        // 如果用户不存在，返回适当的响应或错误
        if (!user) {
            throw new Error('User not found');
        }
        delete user.hashPassword
        // 返回查询到的用户信息
        return user;
    } catch (error) {
        logger.error("Error in GetUserById:", error);
        throw error;
    }
}

export async function DeleteUserById(req) {
    try {
        // 假设用户的 ID 通过请求参数传递
        const userId = req.params.id;
        console.log(userId)
        // 使用 Prisma 删除指定 ID 的用户
        const deletedUser = await prisma.user.delete({
            where: {
                userId:userId,
            },
        });

        return deletedUser;
    } catch (error) {
        logger.error("Error in DeleteUserById:", error);
        throw error;
    }
}

