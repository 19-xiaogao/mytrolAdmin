<template>
  <div class="menu">
    <div
      v-for="item in menuList"
      :key="item.type"
      :class="isActClass(item.type)"
      @click="handleMenuClick(item.type)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    currentIndex: String,
    menuList: Array,
  },
  setup(props, { emit }) {
    const handleMenuClick = (type) => {
      emit("update:currentIndex", type);
    };
    const isActClass = computed(() => {
      return (index) => (props.currentIndex === index ? "act" : "");
    });
    return {
      handleMenuClick,
      isActClass,
    };
  },
};
</script>

<style scoped lang="scss">
.menu {
  height: 36px;
  background: #f1f1f1;
  border-radius: 8px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  div {
    color: #979797;
    height: 24px;
    line-height: 20px;
    width: 100px;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    padding: 4px;
    text-align: center;
    cursor: pointer;
  }
  .act {
    font-size: 14px;
    color: #000000;
    background: #ffffff;
    transition: all 0.3s;
    animation: slidingText 0.4s linear 0s;
  }
}

@keyframes slidingText {
  from {
    transform: translateX(20px);
  }
  to {
    transform: translateX(0px);
  }
}
</style>
