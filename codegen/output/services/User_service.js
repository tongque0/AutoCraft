import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js';
import * as helper from '../../util/helper.js';
import { logger } from "../../util/logger.js";

// 创建User
export async function CreateUser(req) {
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const createdItem = await prisma.user.create({
            data: data,
            // 这里可以添加关联数据的处理
        });
        return createdItem;
    } catch (error) {
        logger.error("Error in CreateUser:", error);
        throw error;
    }
}

// 获取所有User列表（无分页）
export async function GetAllUsersSimple(req) {
    try {
        const items = await prisma.user.findMany({
            // 这里可以添加过滤和排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllUsersSimple:", error);
        throw error;
    }
}

// 获取所有User列表，可以加入分页和筛选逻辑
export async function GetAllUsers(req) {
    const { page, pageSize, ...filters } = req.query;
    try {
        const items = await prisma.user.findMany({
            where: filters,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize), // 确保 take 是整数
            // 这里可以添加排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllUsers:", error);
        throw error;
    }
}

// 获取单个User
export async function GetUserById(req) {
    const id = parseInt(req.params.id);
    try {
        const item = await prisma.user.findUnique({
            where: { id },
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetUserById:", error);
        throw error;
    }
}

// 更新User
export async function UpdateUser(req) {
    const id = parseInt(req.params.id);
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const updatedItem = await prisma.user.update({
            where: { id },
            data: data,
            // 这里可以添加关联数据的处理
        });
        return updatedItem;
    } catch (error) {
        logger.error("Error in UpdateUser:", error);
        throw error;
    }
}

// 删除User
export async function DeleteUser(req) {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.delete({
            where: { id }
        });
        return { message: 'User Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteUser:", error);
        throw error;
    }
}
