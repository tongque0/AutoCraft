import { prisma } from "../../dal/init.js";
import { logger } from "../../util/logger.js";
export function GetRouters(req) {
    return {
        list: [
            {
                path: '/role',
                name: '',
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
                    }
                ]
            },
            {
                path: '/list1',
                name: '',
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
}

