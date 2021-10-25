<template>
  <div class="home">
    <Header />
    <Sidebar />
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
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
