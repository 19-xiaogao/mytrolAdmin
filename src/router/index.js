import { createRouter, createWebHistory } from "vue-router";
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
        component: () =>
          import(
            /* webpackChunkName: 'overview' */ "@/views/Overview/index.vue"
          ),
      },
      {
        path: "/shelves",
        name: "shelves",
        meta: {
          title: "上架",
        },
        component: () =>
          import(/* webpackChunkName: 'Shelves' */ "@/views/Shelves/index.vue"),
      },
      {
        path: "/order",
        name: "order",
        meta: {
          title: "订单",
        },
        component: () =>
          import(/* webpackChunkName: 'Order' */ "@/views/Order/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登陆",
    },
    component: import(/* webpackChunkName: 'Login' */ "@/views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 前置路由拦截
router.beforeEach((to, from, next) => {
  next();
  // const token = getStorageToken() // null | token
  // // 去往非登录页且无 token
  // if (!to.path.includes('login') && !token) {
  //     next('/login')
  // } else {
  //     next()
  // }
});

// 路由后置守卫 由路由信息 设置标签页标题
router.afterEach((to) => {
  let title;
  if (to.meta && to.meta.title) {
    title = to.meta.title + " | Mytrol";
  } else {
    title = "Mytrol";
  }
  document.title = title;
});
export default router;
