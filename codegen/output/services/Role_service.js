import { prisma } from "../../dal/init.js";
import * as util from '../../util/auth.js';
import * as helper from '../../util/helper.js';
import { logger } from "../../util/logger.js";

// 创建Role
export async function CreateRole(req) {
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const createdItem = await prisma.role.create({
            data: data,
            // 这里可以添加关联数据的处理
        });
        return createdItem;
    } catch (error) {
        logger.error("Error in CreateRole:", error);
        throw error;
    }
}

// 获取所有Role列表（无分页）
export async function GetAllRolesSimple(req) {
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
        const items = await prisma.role.findMany({
            where: filters, // 应用过滤条件
            orderBy: orderBy, // 应用排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRolesSimple:", error);
        throw error;
    }
}


// 获取所有Role列表，加入分页和筛选逻辑
export async function GetAllRoles(req) {
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
        const items = await prisma.role.findMany({
            where: filters,
            orderBy: orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRoles:", error);
        throw error;
    }
}


// 获取单个Role
export async function GetRoleById(req) {
    const id = parseInt(req.params.id);
    try {
        const item = await prisma.role.findUnique({
            where: { id },
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetRoleById:", error);
        throw error;
    }
}
// 获取单个Role，支持根据多个条件查询
export async function GetRoleByMultipleFields(req) {
    const query = req.query;
    // 构建动态查询条件
    const queryConditions = {};
    for (const [key, value] of Object.entries(query)) {
        // 可以在这里添加逻辑以验证和格式化查询参数
        queryConditions[key] = value;
    }

    try {
        const item = await prisma.role.findFirst({
            where: queryConditions,
            // 这里可以添加关联数据的加载
        });
        return item;
    } catch (error) {
        logger.error("Error in GetRoleByMultipleFields:", error);
        throw error;
    }
}
// 更新Role
export async function UpdateRole(req) {
    const id = parseInt(req.params.id);
    const data = req.body;
    // 这里可以添加数据验证逻辑
    try {
        const updatedItem = await prisma.role.update({
            where: { id },
            data: data,
            // 这里可以添加关联数据的处理
        });
        return updatedItem;
    } catch (error) {
        logger.error("Error in UpdateRole:", error);
        throw error;
    }
}

// 删除Role
export async function DeleteRole(req) {
    const id = parseInt(req.params.id);
    try {
        await prisma.role.delete({
            where: { id }
        });
        return { message: 'Role Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteRole:", error);
        throw error;
    }
}
