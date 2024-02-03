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
        // 首先删除所有与该角色相关联的RoleRoute记录
        await prisma.roleRoute.deleteMany({
            where: { roleId: id }
        });

        // 然后删除角色
        await prisma.role.delete({
            where: { id: id }
        });

        return { message: 'Role Deleted Successfully' };
    } catch (error) {
        logger.error("Error in DeleteRole:", error);
        throw error;
    }
}
//创建角色路由关联
export async function createOrUpdateRoleWithSelectedRoutes(req) {
    const { role, routeslevel, ...otherRoleData } = req.body;
    try {
        var Role
        if (role.roleId !== -1) {
            Role = await prisma.role.findUnique({
                where: { id: role.roleId },
            });
        }

        if (!Role) {
            // 创建新角色
            Role = await prisma.role.create({
                data: {
                    name: role.rolename,
                    // 其他角色相关数据...
                    isSetup: otherRoleData.status !== '0',
                },
            });
        } else {
            // 更新现有角色
            Role = await prisma.role.update({
                where: { id: role.roleId },
                data: {
                    name: role.rolename,
                    isSetup: otherRoleData.status !== '0',
                },
            });
        }
        await prisma.roleRoute.deleteMany({
            where: {
                roleId: role.roleId
            }
        });
        function transformArray(arr) {
            const result = new Map();

            arr.forEach(item => {
                // 为父元素创建一个条目
                if (!result.has(item.parent)) {
                    result.set(item.parent, { id: item.parent, level: 9 }); // 假设父元素的 level 为 9
                }
                // 为当前元素创建一个条目
                result.set(item.id, { id: item.id, level: item.level });
            });

            return Array.from(result.values());
        }

        await prisma.roleRoute.createMany({
            data: transformArray(routeslevel).map(route => ({
                roleId: role.roleId,
                routeId: route.id,
                level: route.level != null ? route.level : 1 // 将 undefined 转换为 null
            }))
        });


        return "Update successful";
    } catch (error) {
        console.error("Error in createOrUpdateRoleWithSelectedRoutes:", error);
        throw error;
    }
}

//获取角色关联路由
export async function getRoutesForRole(req) {
    const roleId = parseInt(req.params.id);
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
export async function getRoutesForRoleByUserId(userId) {

    try {
        // 获取角色及其关联的路由
        const user = await prisma.user.findUnique({
            where: { userId: userId }
        })
        const roleWithRoutes = await prisma.role.findUnique({
            where: { name: user.role },
            include: {
                roleRoutes: {
                    include: {
                        route: true, // 包含关联的路由详细信息
                    },
                },
            },
        });
        if (!roleWithRoutes) {
            throw new Error('角色不存在');
        }
        console.log(roleWithRoutes)
        return roleWithRoutes.roleRoutes.map(route => route.route);
    } catch (error) {
        console.error("Error in getRoutesForRole:", error);
        throw error;
    }
}

