<template>
  <div class="order-detail" ref="orderDetailRef">
    <div class="header">
      <div>
        订单详情
      </div>
      <icon-svg icon="icon-a-bianzu101" class="icon" @click="handleHideClick"></icon-svg>
    </div>
    <p class="des">
      山舞银河，原驰蜡象，欲与天公试比高
    </p>
    <div class="ikon">
      <img src="@assets/images/order-detail-img.jpg" alt="" />
    </div>
    <div class="dress_chain">
      <p>上链地址</p>
      <span>
        0xf7a21ffb762ef2c14d8713b18f5596b4b0b0490a
      </span>
    </div>
    <div class="dress_token">
      <p>Token ID</p>
      <span>
        0xf7a21ffb762ef2c14d8713b18f5596b4b0b0490a
      </span>
    </div>
    <div class="logo">
      <img src="@assets/images/mytrolLogo.png" alt="" />
    </div>
  </div>
</template>

<script>
import { ref, onUpdated } from "vue";
export default {
  emits: ["clonse"],
  setup(props, { emit }) {
    const orderDetailRef = ref(null);
    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("clonse");
      }, 400);
    };
    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });
    return {
      handleHideClick,
      orderDetailRef,
    };
  },
};
</script>

<style lang="scss">
.order-detail {
  position: absolute;
  right: 10px;
  top: 17px;
  width: 390px;
  height: calc(100% - 60px);
  background: #ffffff;
  box-shadow: -6px 0px 18px 0px rgba(107, 107, 107, 0.16);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 21px;
  animation: sliding-show 0.5s linear 0s;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      flex: 1;
      font-size: 18px;
      color: #000;
    }
    .icon {
      font-size: 1.4rem;
      cursor: pointer;
    }
  }
  .avator {
    margin-top: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      display: inline-block;
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }
    span {
      font-size: 16px;
      font-weight: 600;
      color: #000000;
      margin-left: 10px;
    }
  }
  .des {
    margin-top: 10px;
    font-weight: 400;
    color: #434343;
    font-size: 16px;
    text-align: left;
    color: #434343;
  }
  .ikon {
    width: 348px;
    height: 261px;
    overflow: hidden;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }
  .dress_chain {
    margin-top: 26px;
    text-align: left;
    p {
      text-align: left;
      font-size: 16px;
      color: #000;
      font-weight: 500;
      margin: 0;
    }
    span {
      font-size: 14px;
      font-family: Helvetica;
      color: #000000;
    }
  }
  .dress_token {
    margin-top: 10px;
    text-align: left;
    p {
      text-align: left;
      font-size: 16px;
      color: #000;
      font-weight: 500;
      margin: 0;
    }
    span {
      font-size: 14px;
      font-family: Helvetica;
      color: #000000;
    }
  }
  .logo {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
  }
}
@keyframes sliding-show {
  from {
    transform: translateX(500px);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes sliding-hiden {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(500px);
  }
}
</style>
