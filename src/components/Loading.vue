<template>
  <div class="loader">
    <div class="loading">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <p>加载中......</p>
  </div>
</template>

<script>
export default {
  name: "Loading",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.loader {
  z-index: 100;
  background-color: #333;
  opacity: 0.6;
  width: calc(100vw - 60px);
  height: calc(100vw - 60px);
  position: fixed;
  top: 60px;
  left: 60px;
  z-index: 1111;
  cursor: not-allowed !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 10px;
    color: #fff;
    font-size: 17px;
  }
  .loading {
    margin-top: calc(50vh );
    span {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
      background: #fff;
      transform-origin: right bottom;
      animation: load 1s ease infinite;
      &:first-child {
        animation-delay: 0.13s;
      }
      &:nth-child(2) {
        animation-delay: 0.26s;
      }
      &:nth-child(3) {
        animation-delay: 0.39s;
      }
      &:nth-child(4) {
        animation-delay: 0.52s;
      }
      &:last-child {
        animation-delay: 0.65s;
        margin-right: 0;
      }
    }
  }
}
@keyframes load {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(90deg) scale(0.3);
  }
}
</style>
