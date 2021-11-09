// 超级管理员
export const adminRule = [
  {
    path: "/overview",
    name: "overview",
    meta: {
      title: "总揽",
    },
    component: () =>
      import(/* webpackChunkName: 'overview' */ "@/views/Overview/index.vue"),
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
  {
    path: "/audit",
    name: "audit",
    meta: {
      title: "审核",
    },
    component: () =>
      import(/* webpackChunkName: 'Order' */ "@/views/Audit/index.vue"),
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
    path: "/operation",
    name: "operation",
    meta: {
      title: "运营",
    },
    component: () =>
      import(/*webpackChunkName:'Operation'*/ "@/views/Operation/index.vue"),
  },
  {
    path: "/items",
    name: "item",
    meta: {
      title: "作品",
    },
    component: () =>
      import(/*webpackChunkName:'item'*/ "@/views/Item/index.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    meta: {
      title: "设置",
    },
    component: () =>
      import(/*webpackChunkName:'Setting'*/ "@/views/Setting/index.vue"),
    children: [],
  },
];

// 创造人员

export const makeRule = [
  {
    path: "/overview",
    name: "overview",
    meta: {
      title: "总揽",
    },
    component: () =>
      import(/* webpackChunkName: 'overview' */ "@/views/Overview/index.vue"),
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
    path: "/items",
    name: "item",
    meta: {
      title: "作品",
    },
    component: () =>
      import(/*webpackChunkName:'Item'*/ "@/views/Item/index.vue"),
  },
];

export const operationRule = [
  {
    path: "/overview",
    name: "overview",
    meta: {
      title: "总揽",
    },
    component: () =>
      import(/* webpackChunkName: 'overview' */ "@/views/Overview/index.vue"),
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
    path: "/operation",
    name: "operation",
    meta: {
      title: "运营",
    },
    component: () =>
      import(/*webpackChunkName:'Operation'*/ "@/views/Operation/index.vue"),
  },
];
