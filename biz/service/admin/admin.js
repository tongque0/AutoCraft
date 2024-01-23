
export function GetRouters(req) {
    return {
        list: [
            {
                path: '/list',
                name: 'list',
                component: 'LAYOUT',
                redirect: '/list/base',
                meta: {
                    title: {
                        zh_CN: '列表页',
                        en_US: 'List',
                    },
                    icon: 'view-list',
                },
                children: [
                    {
                        path: 'base',
                        name: 'ListBase',
                        component: '/list/base/index',
                        meta: {
                            title: {
                                zh_CN: '基础列表页',
                                en_US: 'Base List',
                            },
                        },
                    },
                    {
                        path: 'card',
                        name: 'ListCard',
                        component: '/list/card/index',
                        meta: {
                            title: {
                                zh_CN: '卡片列表页',
                                en_US: 'Card List',
                            },
                        },
                    },
                    {
                        path: 'filter',
                        name: 'ListFilter',
                        component: '/list/filter/index',
                        meta: {
                            title: {
                                zh_CN: '筛选列表页',
                                en_US: 'Filter List',
                            },
                        },
                    },
                    {
                        path: 'tree',
                        name: 'ListTree',
                        component: '/list/tree/index',
                        meta: {
                            title: {
                                zh_CN: '树状筛选列表页',
                                en_US: 'Tree List',
                            },
                        },
                    },
                ],
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
