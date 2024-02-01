
import { PrismaClient } from '@prisma/client';

export function InitPrisma() {

    const connectionString = "mysql://NServer:NServer1@sh-cynosdbmysql-grp-rs4nqt7a.sql.tencentcdb.com:20129/NServer";
    try {
        // 使用连接字符串创建PrismaClient实例
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: connectionString,
                },
            },
        });

        // 测试数据库连接
        prisma.$connect()
            .then(() => {
                console.log('成功使用Prisma连接到数据库');
            })
            .catch((err) => {
                console.error('无法连接到MySQL数据库: ', err);
                throw err;
            });

        return prisma;
    } catch (error) {
        console.error("无法初始化Prisma Client: ", error);
        throw error;
    }
}
const prisma = InitPrisma()
const routes = [
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
            },
            {
                path: 'base',
                name: 'UserBase2',
                component: '/userlist/base/index',
                meta: {
                    title: {
                        zh_CN: '用户列表',
                        en_US: 'user List',
                    },
                },
            },
        ]
    },
    {
        path: '/list2',
        name: 'list2',
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
                name: 'UserBase3',
                component: '/userlist/base/index',
                meta: {
                    title: {
                        zh_CN: '用户列表',
                        en_US: 'user List',
                    },
                },
            },
            {
                path: 'base',
                name: 'UserBase4',
                component: '/userlist/base/index',
                meta: {
                    title: {
                        zh_CN: '用户列表',
                        en_US: 'user List',
                    },
                },
            },
        ]
    }
]





// //根据路由定义获取路由关系，然后更新路由表(只允许开发环境调用)
function GetRoutersNameAndChildren(routes, parentName = null) {
    return routes.reduce((acc, route) => {
        const routeInfo = { name: route.name, parent: parentName };

        if (route.children && route.children.length) {
            routeInfo.children = GetRoutersNameAndChildren(route.children, route.name);
        }

        acc.push(routeInfo);
        return acc;
    }, []);
}
const s = GetRoutersNameAndChildren(routes)
//在数据库中建立路由关系
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
//创建路由关系
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

// 调用函数
CreateRoute(s).then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});

//获取全部路由
async function getRoutesArray() {
    try {
        // 从数据库获取所有路由
        const routes = await prisma.route.findMany({
            include: {
                children: {
                    include: {
                        children: true // 这将递归地包含所有子路由
                    }
                }
            },
            where: {
                parentRoute: null // 只获取顶级路由
            }
        });

        // 将路由数据转换为数组形式
        return convertRoutesToHierarchy(routes);
    } catch (error) {
        console.error("Error in getRoutesArray:", error);
        throw error;
    }
}

function convertRoutesToHierarchy(routes) {
    return routes.map(route => {
        const routeObj = {
            id: route.id,
            name: route.name,
            // 其他可能的属性
            children: route.children ? convertRoutesToHierarchy(route.children) : []
        };
        return routeObj;
    });
}

// 调用函数
getRoutesArray().then(routesArray => {
    console.log(routesArray);
}).catch(error => {
    console.error(error);
});
