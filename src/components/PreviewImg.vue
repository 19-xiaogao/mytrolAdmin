<template>
  <a-modal
    :visible="visible"
    class="modal"
    @cancel="hanldeClick"
    :centered="true"
    :footer="null"
  >
    <img :src="imgUrl" class="img" />
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    imgUrl: String,
  },
  setup(props, { emit }) {
    const hanldeClick = () => {
      emit("update:visible", false);
    };
    return { hanldeClick };
  },
};
</script>

<style lang="scss" scoped>
.modal {
  width: 520px;
  transform-origin: 421px 377px;
  .img {
    width: 100%;
  }
}
</style>
