import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: import(/* webpackChunkName: 'Home' */ '@/views/Home'),
    children: [
      {
        path: "/",
        component: () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/views/Commanding/index.vue'),
      },
      {
        path: "/audit",
        component: () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/views/Commanding/index.vue'),
      },
      {
        path: "/order",
        component: () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/views/Order/index.vue'),
      },
     
    ],
  },
  {
    path: "/login",
    name: "login",
    component: import(/* webpackChunkName: 'Login' */ "@/views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
