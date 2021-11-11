<template>
  <header>
    <div class="logo" @click="handleRouteClick">
      <img src="@assets/images/mytrolLogo.png" alt="" />
    </div>
    <a-dropdown>
      <div class="avator-message">
        <div class="avator">
          <img :src="personMessage.avatar" alt="" />
        </div>
        <span class="select">{{ personMessage.nickname }} </span>
        <icon-svg icon="icon-xiangxia1"></icon-svg>
      </div>

      <template #overlay>
        <a-menu>
          <a-menu-item @click="handleRouteLogin">
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </header>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { logoutApi } from "@api";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const personMessage = computed(() => store.getters.getPersonMessage);
    const handleRouteClick = () => {
      router.push("/");
    };
    const handleRouteLogin = async () => {
      const { err_code } = await logoutApi();
      if (err_code == 0) {
        router.push("/login");
        localStorage.clear();
      }
    };
    return {
      value2: ref("lucy"),
      handleRouteClick,
      handleRouteLogin,
      personMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
header {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100vw;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(97, 97, 97, 0.16);
  .logo {
    display: flex;
    align-items: flex-end;
    margin-left: 10px;
    cursor: pointer;
  }
  .avator-message {
    display: flex;
    align-items: center;
    margin-right: 30px;
    ::v-deep .ant-select-selector {
      border: none !important;
    }
    ::v-deep .ant-select-selection-item {
      color: #000 !important;
    }
    .avator {
      width: 30px;
      height: 30px;
      background: #eee;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .select {
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .waring {
    cursor: pointer;
  }
}
</style>
