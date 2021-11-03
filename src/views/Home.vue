<template>
  <div class="home">
    <Header />
    <Sidebar />
    <UserSettingModal />
    <div class="body">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <transition name="fadeRightIn">
            <component :is="Component" />
          </transition>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UserSettingModal from "@/components/UserSettingModal";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
    UserSettingModal,
  },
  setup() {
    const store = useStore()
    const roleVux = computed(() => store.state.getRole);
    console.log(roleVux.value);
    return {};
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  animation: backInUp 0.4s linear;
  .body {
    position: absolute;
    top: 60px;
    left: 60px;
    background-color: #f5f5f5;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    padding: 14px 20px 20px 14px;

    box-sizing: border-box;
  }
}
</style>
