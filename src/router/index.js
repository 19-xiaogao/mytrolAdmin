import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { getStorageRole } from "@/utils";

import Home from "@/views/Home";

const routes = [
    {
        path: "/",
        name: "Mytrol",
        redirect: "/overview",
        component: Home,
        children: [
            {
                path: "/overview",
                name: "overview",
                meta: {
                    title: "总揽",
                },
                component: () => import(/* webpackChunkName: 'overview' */ "@/views/Overview/index.vue"),
            },
            {
                path: "/record",
                name: "record",
                meta: {
                    title: "订单",
                },
                component: () => import(/* webpackChunkName: 'record' */ "@/views/Record/index.vue"),
            },
            {
                path: "/audit",
                name: "audit",
                meta: {
                    title: "审核",
                },
                component: () => import(/* webpackChunkName: 'Audit' */ "@/views/Audit/index.vue"),
            },
            {
                path: "/shelves",
                name: "shelves",
                meta: {
                    title: "上架",
                },
                component: () => import(/* webpackChunkName: 'Shelves' */ "@/views/Shelves/index.vue"),
            },
            {
                path: "/operation",
                name: "operation",
                meta: {
                    title: "运营",
                },
                component: () => import(/*webpackChunkName:'Operation'*/ "@/views/Operation/index.vue"),
            },
            {
                path: "/items",
                name: "item",
                meta: {
                    title: "作品",
                },
                component: () => import(/*webpackChunkName:'item'*/ "@/views/Item/index.vue"),
            },
            {
                path: "/setting",
                name: "setting",
                meta: {
                    title: "设置",
                },
                component: () => import(/*webpackChunkName:'Setting'*/ "@/views/Setting/index.vue"),
                children: [],
            },
            {
                path: "/query",
                name: "query",
                meta: {
                    title: "查询",
                },
                component: () => import(/*webpackChunkName:'Setting'*/ "@/views/Query/index.vue"),
                children: [],
            },
            {
                path: "/whitelist",
                name: "Whitelist",
                meta: {
                    title: "白名单",
                },
                component: () => import(/*webpackChunkName:'whitelist'*/ "@/views/Whitelist/index.vue"),
                children: [],
            },
            {
                path: "/whitelist/detail",
                name: "Whitelist_detail",
                meta: {
                    title: "白名单详情",
                },
                component: () => import(/*webpackChunkName:'WhitelistDetail'*/ "@/views/Whitelist/WhiteDetail.vue"),
                children: [],
            },
        ],
    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: "登录",
        },
        component: () => import(/* webpackChunkName: 'Login' */ "@/views/Login.vue"),
    },
    {
        path: "/share",
        name: "share",
        meta: {
            title: "分享",
        },
        component: () => import(/* webpackChunkName:'Share'*/ "@/views/Share.vue"),
    },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        meta: {
            title: "Not Found",
        },
        component: () => import(/* webpackChunkName: 'NotFound' */ "@/views/NotFound"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 前置路由拦截
router.beforeEach((to, from, next) => {
    const role = JSON.parse(getStorageRole());

    if (to.path.includes("share")) {
        next();
    }
    if (!to.path.includes("login") && !role) {
        next("/login");
    } else {
        next();
    }
});

// 路由后置守卫 由路由信息 设置标签页标题
router.afterEach((to) => {
    let title;
    store.commit("setLoading", false);
    if (to.meta && to.meta.title) {
        title = to.meta.title + " | Mytrol";
    } else {
        title = "Mytrol";
    }
    document.title = title;
});
export default router;
