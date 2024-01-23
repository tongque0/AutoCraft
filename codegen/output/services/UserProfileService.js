import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js';
import * as helper from '../../util/helper.js';
import { logger } from "../../util/logger.js";

// 创建UserProfile
export async function CreateUserProfile(req) {
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const createdItem = await prisma.userprofile.create({
            data: data,
            // 这里可以添加关联数据的处理
        });
        return createdItem;
    } catch (error) {
        logger.error("Error in CreateUserProfile:", error);
        throw error;
    }
}

// 获取所有UserProfile列表（无分页）
export async function GetAllUserProfilesSimple(req) {
    try {
        const items = await prisma.userprofile.findMany({
            // 这里可以添加过滤和排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllUserProfilesSimple:", error);
        throw error;
    }
}

// 获取所有UserProfile列表，可以加入分页和筛选逻辑
export async function GetAllUserProfiles(req) {
    const { page, pageSize, ...filters } = req.query;
    try {
        const items = await prisma.userprofile.findMany({
            where: filters,
            skip: (page - 1) * pageSize,
            take: pageSize,
            // 这里可以添加排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllUserProfiles:", error);
        throw error;
    }
}

// 获取单个UserProfile
export async function GetUserProfileById(req) {
    const { id } = req.params;
    try {
        const item = await prisma.userprofile.findUnique({
            where: { id },
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetUserProfileById:", error);
        throw error;
    }
}

// 更新UserProfile
export async function UpdateUserProfile(req) {
    const { id } = req.params;
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const updatedItem = await prisma.userprofile.update({
            where: { id },
            data: data,
            // 这里可以添加关联数据的处理
        });
        return updatedItem;
    } catch (error) {
        logger.error("Error in UpdateUserProfile:", error);
        throw error;
    }
}

// 删除UserProfile
export async function DeleteUserProfile(req) {
    const { id } = req.params;
    try {
        await prisma.userprofile.delete({
            where: { id }
        });
        return { message: 'UserProfile Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteUserProfile:", error);
        throw error;
    }
}
