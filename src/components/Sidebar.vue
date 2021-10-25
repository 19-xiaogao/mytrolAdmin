<template>
  <ul class="sidebar">
    <router-link v-for="item in menus" :to="item.path" :key="item.id">
      <li>
        <img :src="item.icon" alt="" />
        <span>{{ item.text }}</span>
      </li>
    </router-link>
  </ul>
</template>

<script>
import { reactive } from "@vue/reactivity";
import homeIcon from "../assets/images/homeIcon.png";

const menu = [
  {
    icon: homeIcon,
    text: "总揽",
    id: 1,
    path: "/",
  },
  {
    icon: homeIcon,
    text: "创作",
    path: "/audit",
    id: 2,
  },
  {
    icon: homeIcon,
    text: "订单",
    path: "/order",
    id: 3,
  },
 
];
export default {
  setup() {
    const menus = reactive(menu);
    return { menus };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  width: 60px;
  background: var(--white);
  box-shadow: 4px 0px 8px 0px rgba(156, 156, 156, 0);
  overflow: hidden;
  padding-top: 60px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 60px;
    border-left: 2px solid #2f0088;
    margin-bottom: 10px;
    span {
      font-size: 12px;
      font-weight: 500;
      color: #adadad;
    }
  }
}
</style>
