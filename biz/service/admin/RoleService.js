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
    try {
        const items = await prisma.role.findMany({
            // 这里可以添加过滤和排序逻辑
        });
        return items;
    } catch (error) {
        logger.error("Error in GetAllRolesSimple:", error);
        throw error;
    }
}

// 获取所有Role列表，可以加入分页和筛选逻辑
export async function GetAllRoles(req) {
    const { page, pageSize, ...filters } = req.query;
    try {
        const items = await prisma.role.findMany({
            where: filters,
            skip: (parseInt(page) - 1) * parseInt(pageSize),
            take: parseInt(pageSize), // 确保 take 是整数
            // 这里可以添加排序逻辑
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

//创建角色路由关联
export async function createOrUpdateRoleWithSelectedRoutes(req) {
    const { roleId, selectedRouteIds, ...otherRoleData } = req.body;
    console.log(roleId, selectedRouteIds);

    try {
        // 更新角色的路由关联
        const updatedRole = await prisma.role.update({
            where: { id: roleId },
            data: {
                routes: {
                    set:[], // 先清空现有的关联
                    connect: selectedRouteIds.map(id => ({ id })), // 然后建立新的关联
                },
            },
        });

        return updatedRole;
    } catch (error) {
        console.error("Error in updateRoleRoutes:", error);
        throw error;
    }
}
//获取角色关联路由
export async function getRoutesForRole(req) {
    const roleId = parseInt(req.params.id );
    try {
        // 获取角色及其关联的路由
        const roleWithRoutes = await prisma.role.findUnique({
            where: { id: roleId },
            include: {
                routes: true, // 包含关联的路由
            },
        });

        if (!roleWithRoutes) {
            throw new Error('角色不存在');
        }

        return roleWithRoutes.routes;
    } catch (error) {
        console.error("Error in getRoutesForRole:", error);
        throw error;
    }
}
