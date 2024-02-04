import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js';
import * as helper from '../../util/helper.js';
import { logger } from "../../util/logger.js";

// 创建RoleRoute
export async function CreateRoleRoute(req) {
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const createdItem = await prisma.roleroute.create({
            data: data,
            // 这里可以添加关联数据的处理
        });
        return createdItem;
    } catch (error) {
        logger.error("Error in CreateRoleRoute:", error);
        throw error;
    }
}

// 获取所有RoleRoute列表（无分页）
export async function GetAllRoleRoutesSimple(req) {
    const { sort, sortOrder, ...filters } = req.query;

    // 构建排序参数
    let orderBy = {};
    if (sort) {
        orderBy[sort] = sortOrder && sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else {
        // 可以在这里设置默认排序逻辑
        // 例如: orderBy = { id: 'asc' };
    }

    try {
        const items = await prisma.roleroute.findMany({
            where: filters, // 应用过滤条件
            orderBy: orderBy, // 应用排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRoleRoutesSimple:", error);
        throw error;
    }
}


// 获取所有RoleRoute列表，加入分页和筛选逻辑
export async function GetAllRoleRoutes(req) {
    // 设定分页和排序的默认值
    const defaultPage = 1;
    const defaultPageSize = 10;
    const defaultSortField = 'id'; // 假设 'id' 是默认排序字段
    const defaultSortOrder = 'asc'; // 默认为升序排序

    let { page, pageSize, sort, sortOrder, ...filters } = req.query;

    // 验证和处理分页参数
    page = parseInt(page) || defaultPage;
    pageSize = parseInt(pageSize) || defaultPageSize;

    // 验证和处理排序参数
    sort = sort || defaultSortField;
    sortOrder = (sortOrder && sortOrder.toLowerCase() === 'desc') ? 'desc' : 'asc';

    // 构建排序对象
    const orderBy = {};
    orderBy[sort] = sortOrder;

    try {
        const items = await prisma.roleroute.findMany({
            where: filters,
            orderBy: orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRoleRoutes:", error);
        throw error;
    }
}


// 获取单个RoleRoute
export async function GetRoleRouteById(req) {
    const id = parseInt(req.params.id);
    try {
        const item = await prisma.roleroute.findUnique({
            where: { id },
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetRoleRouteById:", error);
        throw error;
    }
}
// 获取单个RoleRoute，支持根据多个条件查询
export async function GetRoleRouteByMultipleFields(req) {
    const query = req.query;
    // 构建动态查询条件
    const queryConditions = {};
    for (const [key, value] of Object.entries(query)) {
        // 可以在这里添加逻辑以验证和格式化查询参数
        queryConditions[key] = value;
    }

    try {
        const item = await prisma.roleroute.findFirst({
            where: queryConditions,
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetRoleRouteByMultipleFields:", error);
        throw error;
    }
}
// 更新RoleRoute
export async function UpdateRoleRoute(req) {
    const id = parseInt(req.params.id);
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const updatedItem = await prisma.roleroute.update({
            where: { id },
            data: data,
            // 这里可以添加关联数据的处理
        });
        return updatedItem;
    } catch (error) {
        logger.error("Error in UpdateRoleRoute:", error);
        throw error;
    }
}

// 删除RoleRoute
export async function DeleteRoleRoute(req) {
    const id = parseInt(req.params.id);
    try {
        await prisma.roleroute.delete({
            where: { id }
        });
        return { message: 'RoleRoute Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteRoleRoute:", error);
        throw error;
    }
}
