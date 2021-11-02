<template>
  <ul class="sidebar">
    <router-link v-for="item in menus" :to="item.path" :key="item.id">
      <li>
        <p :class="isOpacity(item.path)"></p>
        <div class="icons">
          <icon-svg
            :icon="item.icon"
            class="icon"
            :style="isColor(item.path)"
          ></icon-svg>
          <span :style="isColor(item.path)">{{ item.text }}</span>
        </div>
      </li>
    </router-link>
  </ul>
</template>

<script>
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
const menu = [
  {
    icon: "icon-icon2-hover1",
    text: "总揽",
    id: 1,
    path: "/overview",
  },
  {
    icon: "icon-a-bianzu4",
    text: "订单",
    path: "/order",
    id: 3,
  },
  {
    icon: "icon-icon3",
    text: "上架",
    path: "/shelves",
    id: 2,
  },
  {
    icon: "icon-a-bianzu32",
    text: "运营",
    path: "/operation",
    id: 3,
  },
  {
    icon: "icon-a-bianzu3",
    text: "作品",
    path: "/items",
    id: 4,
  },
  {
    icon: "icon-a-bianzu311",
    text: "设置",
    path: "/setting",
    id: 5,
  },
];
export default {
  setup() {
    const route = useRoute();
    const currentPath = computed(() => route.path);
    const isOpacity = computed(() => (path) =>
      path === currentPath.value ? "" : "opacity"
    );
    const isColor = computed(() => (path) =>
      path === currentPath.value ? "color:#ED6637" : ""
    );
    const menus = reactive(menu);
    return { menus, isOpacity, isColor };
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
    align-items: center;
    .icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      .icon {
        font-size: 2rem;
        color: #adadad;
      }
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
.gradient {
  color: #ffca2a;
}
.opacity {
  opacity: 0;
}
</style>
