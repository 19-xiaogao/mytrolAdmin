<template>
  <header>
    <div class="logo">
      <img src="../assets/images/mytrolLogo.png" alt="" />
      <span>后台</span>
    </div>
    <div class="avator-message">
      <div class="avator">
        <img src="../assets/images/avtor.png" alt="" />
      </div>
      <a-select v-model:value="value2" style="width: 80px">
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      <div class="waring">
        <img src="../assets/images/bell.png" alt="" />
      </div>
    </div>
  </header>
</template>

<script>
import { Select } from "ant-design-vue";
import { ref } from "vue";
export default {
  components: {
    "a-select": Select,
  },
  setup() {
    return {
      value2: ref("lucy"),
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
    select {
      margin: 0 10px;
    }
  }
}
</style>
