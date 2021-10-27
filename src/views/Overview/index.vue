<template>
  <div class="overivew">
    <div class="edit-message">
    <PersonSpace />
    <EditBanner />
  </div>
  <DetaAnalysis />
  </div>
</template>

<script>
import PersonSpace from "./components/PersonalSpace";
import EditBanner from "./components/EditBanner";
import DetaAnalysis from "./components/DataAnalysis/index.vue";
export default {
  components: {
    PersonSpace,
    EditBanner,
    DetaAnalysis,
  },
};
</script>

<style lang="scss" scoped>
.overivew{
  width: 100%;
  height: 100%;
}
.edit-message {
  display: flex;
  justify-content: space-between;
}
</style>
