import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { getStorageRole } from "@/utils";
import { adminRule } from "./roleArray";
import Home from "@/views/Home";
// 这里还有个需求
const routes = [
  {
    path: "/",
    name: "Mytrol",
    redirect: "/overview",
    component: Home,
    children: adminRule,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登陆",
    },
    component: () =>
      import(/* webpackChunkName: 'Login' */ "@/views/Login.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    meta: {
      title: "Not Found",
    },
    component: () =>
      import(/* webpackChunkName: 'NotFound' */ "@/views/NotFound"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 前置路由拦截
router.beforeEach((to, from, next) => {
  const role = JSON.parse(getStorageRole());
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
