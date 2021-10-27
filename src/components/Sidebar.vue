<template>
  <ul class="sidebar">
    <router-link v-for="item in menus" :to="item.path" :key="item.id">
      <li>
        <p></p>
        <div class="icons">
          <img :src="item.icon" alt="" />
          <span>{{ item.text }}</span>
        </div>
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
    path: "/overview",
  },
  {
    icon: homeIcon,
    text: "上架",
    path: "/shelves",
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
  padding-top: 80px;
  li {
    height: 60px;
    margin-bottom: 10px;
    display: flex;
    
    // flex-direction: column;
    align-items: center;
    .icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      span {
        font-size: 12px;
        font-weight: 500;
        color: #adadad;
      }
    }

    p {
      width: 4px;
      height: 60px;
      border-radius: 10px;
      margin-right: 10px;
      background: linear-gradient(360deg, #ff451d 0%, #ffca2a 100%);
    }
  }
}
</style>
