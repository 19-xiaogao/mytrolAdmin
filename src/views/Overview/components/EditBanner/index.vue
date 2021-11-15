<template>
  <div class="edit-banner">
    <div class="title-menu">
      <h3>首页Banner</h3>
      <TabBar
        v-model:currentIndex="currentMenu"
        :menuList="menuList"
        class="tab-bar"
      />
    </div>

    <PCBanner v-if="currentMenu === '1'" />

    <SwitBanner v-if="currentMenu === '2'" :smallProgram="false" />

    <SwitBanner v-if="currentMenu === '3'" :smallProgram="true" />

  </div>
</template>

<script>
import SwitBanner from "./SwitBanner";
import PCBanner from "./PCBanner.vue";
import TabBar from "@/components/TabBar";
import { ref, reactive } from "vue";
const menus = [
  {
    text: "PC",
    type: "1",
  },
  {
    text: "小程序",
    type: "2",
  },
  {
    text: "运营",
    type: "3",
  },
];
export default {
  components: {
    SwitBanner,
    PCBanner,
    TabBar,
  },
  setup() {
    const currentMenu = ref("1");
    const menuList = reactive(menus);

    return {
      currentMenu,
      menuList,
    };
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  width: 35%;
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
