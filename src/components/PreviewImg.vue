<template>
  <a-modal
      :centered="true"
      :footer="null"
      :visible="visible"
      class="modal"
      @cancel="handleClick"
  >
    <img :src="imgUrl" class="img"/>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    imgUrl: String,
  },
  setup(props, {emit}) {
    const handleClick = () => {
      emit("update:visible", false);
    };
    return {handleClick};
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
