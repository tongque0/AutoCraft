import { prisma } from "../../dal/init.js";
import { logger } from "../../util/logger.js";
import { getRoutesForRoleByUserId } from './RoleService.js'

//此文件为后台管理的重中之重，负责根据角色生成路由。
//此数组为路由树，所有前端页面应在路由树中注册，否则无法渲染
// 定义静态的全局路由树，用于在应用中注册所有前端页面
function allroute() {
    return [
        {
            path: '/role',
            name: 'role',
            component: 'LAYOUT',
            redirect: '/userlist/base',
            meta: {
                title: {
                    zh_CN: '角色管理',
                    en_US: 'UserList',
                },
                icon: 'view-list',
            },
            children: [
                {
                    path: 'base',
                    name: 'rolelist',
                    component: '/role/rolelist/index',
                    meta: {
                        title: {
                            zh_CN: '角色列表',
                            en_US: 'user List',
                        },
                    },
                },
            ]
        },
        {
            path: '/list1',
            name: 'list',
            component: 'LAYOUT',
            redirect: '/userlist/base',
            meta: {
                title: {
                    zh_CN: '用户管理',
                    en_US: 'UserList',
                },
                icon: 'view-list',
            },
            children: [
                {
                    path: 'base',
                    name: 'UserBase1',
                    component: '/userlist/base/index',
                    meta: {
                        title: {
                            zh_CN: '用户列表',
                            en_US: 'user List',
                        },
                    },
                }
            ]
        }
    ]
}

// 获取与特定用户角色相关的路由
export async function GetRouters(req) {
    try {
        const { userId } = req.user;
        console.log(userId)
        const roleRoutes = await getRoutesForRoleByUserId(userId);
        console.log(roleRoutes)
        if (!roleRoutes) {
            logger.error("未能获取角色路由信息");
            throw new Error("未能获取角色路由信息");
        }
        // updateRouteTable()
        return { list: filterRoutesWithRoleData(allroute(), roleRoutes) };
    } catch (error) {
        logger.error("获取路由时出错：", error);
        throw new Error("获取路由失败");
    }
}
// 获取角色路由树并更新其标题信息
export async function GetRouterTree(req) {
    try {
        const { name = '' } = req.query;
        const roleRoutes = await getAllRoleRoutes(name);
        if (!roleRoutes) {
            logger.error("未能获取角色路由信息");
            throw new Error("未能获取角色路由信息");
        }
        const updatedTree = updateRoleRoutesWithTitles(roleRoutes);

        return updatedTree;
    } catch (error) {
        logger.error("获取路由时出错：", error);
        throw new Error("获取路由失败");
    }
}


// 更新数据库中的路由树
async function updateRouteTable() {
    try {
        const currentRoutesStructure = GetRoutersNameAndChildren(allRoutes);
        console.log(currentRoutesStructure)
        const result = await CreateRoute(currentRoutesStructure);
        console.log("路由表更新成功", result);
    } catch (error) {
        console.error("更新路由表时出错：", error);
    }
}

// 根据角色数据过滤路由树
function filterRoutesWithRoleData(routes, roleRoutes) {
    // 首先创建快速查询结构
    const roleRoutesMap = roleRoutes.reduce((acc, route) => {
        acc[route.name] = route;
        return acc;
    }, {});

    // 然后过滤路由树
    const filter = (routes) => {
        return routes.filter(route => {
            // 检查路由是否在角色路由中
            if (roleRoutesMap[route.name]) {
                // 如果有子路由，递归过滤子路由
                if (route.children && route.children.length > 0) {
                    route.children = filter(route.children);
                }
                return true;
            }
            return false;
        });
    };

    return filter(routes);
}
// 为角色路由设置标题
async function updateRoleRoutesWithTitles(roleRoutes) {
    // 获取总路由树
    const allRoutes = allroute();

    // 创建一个包含所有路由名称的集合
    const allRouteNames = new Set();
    const addRouteNames = (routes) => {
        routes.forEach(route => {
            allRouteNames.add(route.name);
            if (route.children) {
                addRouteNames(route.children);
            }
        });
    };
    addRouteNames(allRoutes);

    // 过滤 roleRoutes 并添加 title
    const updateRoutes = (routes) => {
        return routes
            .filter(route => allRouteNames.has(route.name)) // 过滤不存在于总路由树中的路由
            .map(route => {
                const routeInAllRoutes = findRouteByName(allRoutes, route.name); // 查找总路由树中的对应路由
                let children = route.children ? updateRoutes(route.children) : [];
                return {
                    ...route,
                    title: routeInAllRoutes?.meta.title, // 添加 title
                    children: children
                };
            });
    };

    return updateRoutes(roleRoutes);
}
// 在总路由树中查找特定名称的路由
function findRouteByName(routes, name) {
    for (const route of routes) {
        if (route.name === name) {
            return route;
        }
        if (route.children) {
            const found = findRouteByName(route.children, name);
            if (found) return found;
        }
    }
    return null;
}
// 获取所有路由并根据角色名设置 enable 属性
async function getAllRoleRoutes(roleName) {
    try {
        // 直接查找所有路由
        const routes = await prisma.route.findMany({
            where: {
                parentRoute: null,  // 仅选择没有父路由的路由（顶级路由）
            },
            include: {
                children: {
                    include: {
                        allowedRoles: true, // 包含子路由的 allowedRoles
                    }
                },
                allowedRoles: true
            },
        });

        // 递归地设置每个路由的 enable 属性
        const setEnableBasedOnRole = (routes) => {
            return routes.map(route => {
                const enabled = route.allowedRoles.some(role => role.name === roleName);
                let children = route.children ? setEnableBasedOnRole(route.children) : [];

                return {
                    ...route,
                    enable: enabled,
                    children: children
                };
            });
        };

        return setEnableBasedOnRole(routes);
    } catch (error) {
        console.error("Error in getAllRoutes:", error);
        throw error;
    }
}

// 根据路由树获取路由关系
function GetRoutersNameAndChildren(routes, parentName = null) {
    return routes.map(route => ({
        name: route.name,
        title: route.meta.title,
        parent: parentName,
        enable: false,
        children: route.children ? GetRoutersNameAndChildren(route.children, route.name) : []
    }));
}

// 根据路由树获取路由关系
async function createOrUpdateRoute(routeData, parentId = null) {
    const { name, children } = routeData;
    let route;

    try {
        // 尝试找到已存在的路由记录
        route = await prisma.route.findUnique({
            where: { name },
        });

        // 如果路由不存在，则创建一个新的
        if (!route) {
            route = await prisma.route.create({
                data: {
                    name,
                    parentRoute: parentId,
                    // 其他可能的字段可以在这里添加
                },
            });
        }

        // 处理子路由
        if (children && children.length) {
            for (const child of children) {
                await createOrUpdateRoute(child, route.id);
            }
        }

        return route;
    } catch (error) {
        throw error;
    }
}
// 创建整个路由树
async function CreateRoute(routesData) {
    try {
        // 遍历每个顶级路由，并递归创建/更新它们及其子路由
        for (const route of routesData) {
            await createOrUpdateRoute(route);
        }

        return { success: true, message: "Routes created/updated successfully" };
    } catch (error) {

        throw error;
    }
}
