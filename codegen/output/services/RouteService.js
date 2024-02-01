import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js';
import * as helper from '../../util/helper.js';
import { logger } from "../../util/logger.js";

// 创建Route
export async function CreateRoute(req) {
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const createdItem = await prisma.route.create({
            data: data,
            // 这里可以添加关联数据的处理
        });
        return createdItem;
    } catch (error) {
        logger.error("Error in CreateRoute:", error);
        throw error;
    }
}

// 获取所有Route列表（无分页）
export async function GetAllRoutesSimple(req) {
    try {
        const items = await prisma.route.findMany({
            // 这里可以添加过滤和排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRoutesSimple:", error);
        throw error;
    }
}

// 获取所有Route列表，可以加入分页和筛选逻辑
export async function GetAllRoutes(req) {
    const { page, pageSize, ...filters } = req.query;
    try {
        const items = await prisma.route.findMany({
            where: filters,
            skip: (page - 1) * pageSize,
            take: pageSize,
            // 这里可以添加排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRoutes:", error);
        throw error;
    }
}

// 获取单个Route
export async function GetRouteById(req) {
    const { id } = req.params;
    try {
        const item = await prisma.route.findUnique({
            where: { id },
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetRouteById:", error);
        throw error;
    }
}

// 更新Route
export async function UpdateRoute(req) {
    const { id } = req.params;
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const updatedItem = await prisma.route.update({
            where: { id },
            data: data,
            // 这里可以添加关联数据的处理
        });
        return updatedItem;
    } catch (error) {
        logger.error("Error in UpdateRoute:", error);
        throw error;
    }
}

// 删除Route
export async function DeleteRoute(req) {
    const { id } = req.params;
    try {
        await prisma.route.delete({
            where: { id }
        });
        return { message: 'Route Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteRoute:", error);
        throw error;
    }
}
