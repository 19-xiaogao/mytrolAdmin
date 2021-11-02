<template>
  <header>
    <div class="logo" @click="handleRouteClick">
      <img src="@assets/images/mytrolLogo.png" alt="" />
    </div>
    <div class="avator-message">
      <div class="avator">
        <img src="@assets/images/avtor.png" alt="" />
      </div>
      <a-select class="select" v-model:value="value2">
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      <div class="waring">
        <img src="@assets/images/bell.png" @click="handleRouteLogin" alt="" />
      </div>
    </div>
  </header>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  setup() {
    const router = useRouter();
    const handleRouteClick = () => {
      router.push("/");
    };
    const handleRouteLogin = () => {
      router.push("/login");
    };
    return {
      value2: ref("lucy"),
      handleRouteClick,
      handleRouteLogin,
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
    margin-right: 10px;
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
      img {
        width: 100%;
        height: 100%;
      }
    }
    .select {
      margin: 0 10px;
      width: 80px;
    }
  }
}
</style>
