<template>
  <img class="loading" src="@assets/images/mytrol_loading.png" alt="" />
</template>
<script>
import { onMounted, onUnmounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      document.querySelector("body").style.cursor = "not-allowed";
    });
    onUnmounted(() => {
      document.querySelector("body").style.cursor = "auto";
    });
  },
};
</script>
<style lang="scss" scoped>
// .box {
//   position: relative;
//   // width: 100%;
//   // height: 100%;
//   cursor: not-allowed !important;
//   z-index: 11111;
// }
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1111;
}
</style>
