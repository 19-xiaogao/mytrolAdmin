<template>
  <div class="home">
    <Header />
    <Sidebar />
    <UserSettingModal v-if="!isShowEditModal" />
    <div class="body">
      <Loading v-show="loading" />
      <a-config-provider :locale="locale">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <transition name="fadeRightIn">
              <component :is="Component" />
            </transition>
          </keep-alive>
        </router-view>
      </a-config-provider>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import { getStorageRole } from "@/utils";

import zhCN from "ant-design-vue/es/locale/zh_CN";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UserSettingModal from "@/components/UserSettingModal";
import Loading from "@/components/Loading";

export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
    UserSettingModal,
    Loading,
  },
  setup() {
    const store = useStore();
    // 解决刷新 store没有数据的问题。
    const personMessage = JSON.parse(localStorage.getItem("personMessage"));
    store.commit("setPersonMessage", personMessage);
    store.commit("setUser", JSON.parse(getStorageRole()));

    const person = computed(() => store.getters.getPersonMessage);
    const isShowEditModal = computed(() => !!person.value.nickname);
    const loading = computed(() => store.getters.getLoading);

    return { isShowEditModal, locale: zhCN, loading };
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
