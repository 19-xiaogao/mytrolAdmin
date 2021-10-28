<template>
  <div class="edit-banner">
    <div class="title-menu">
      <h3>首页Banner</h3>
      <div class="menu">
        <div
          v-for="item in menuList"
          :key="item.type"
          :class="currentMenu === item.type ? 'act' : ''"
          @click="handleMenuClick(item.type)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <!-- <transition name="banner"> -->
      <PCBanner v-if="currentMenu === 1" />
    <!-- </transition> -->
    <!-- <transition name="banner"> -->
      <SwitBanner v-if="currentMenu === 2" :smallProgram="false" />
    <!-- </transition> -->
    <!-- <transition name="banner"> -->
      <SwitBanner v-if="currentMenu === 3" :smallProgram="true" />
    <!-- </transition> -->
  </div>
</template>

<script>
import SwitBanner from "./SwitBanner";
import PCBanner from "./PCBanner.vue";
import { reactive, ref } from "vue";
const menus = [
  {
    text: "PC",
    type: 1,
  },
  {
    text: "小程序",
    type: 2,
  },
  {
    text: "运营",
    type: 3,
  },
];
export default {
  components: {
    SwitBanner,
    PCBanner,
  },
  setup() {
    const menuList = reactive(menus);
    const currentMenu = ref(1);
    const handleMenuClick = (type) => {
      currentMenu.value = type;
    };
    return {
      menuList,
      currentMenu,
      handleMenuClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu {
  height: 36px;
  background: #f1f1f1;
  border-radius: 8px;
  width: 35%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  div {
    color: #979797;
    height: 24px;
    line-height: 20px;
    width: 100px;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    padding: 4px;
    cursor: pointer;
  }
  .act {
    font-size: 14px;
    color: #000000;
    background: #ffffff;
    transition: all 0.3s;
    animation: slidingText 0.4s linear 0s;
  }
}

@keyframes slidingText {
  from {
    transform: translateX(-20px);
  }
  to {
    transform: translateX(0px);
  }
}
.edit-banner {
  width: 58%;
  height: 33.11%;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
  border-radius: 8px;
  border: 0px solid rgba(213, 213, 213, 0.58);
  box-sizing: border-box;
  padding: 21px 30px;
  .title-menu {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    h3 {
      text-align: left;
    }
  }
}
</style>
