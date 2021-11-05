<template>
  <div class="order-detail" ref="orderDetailRef">
    <div class="header">
      <div>
        审核详情
      </div>
      <icon-svg
        icon="icon-a-bianzu101"
        class="icon"
        @click="handleHideClick"
      ></icon-svg>
    </div>
    <div class="avator">
      <img :src="messageDetail.avatar" alt="" />
      <span>{{ messageDetail.nickname }}</span>
    </div>
    <p class="des">
      {{ messageDetail.description }}
    </p>
    <div class="ikon">
      <img :src="joinPreviewUrl(messageDetail.file)" alt="" />
    </div>
    <div class="ikon">
      <img :src="joinPreviewUrl(messageDetail.file_background)" alt="" />
    </div>
    <div class="audit-box">
      <div @click="handleAuditClick(true)">通过</div>
      <div @click="handleAuditClick(false)">不通过</div>
    </div>
  </div>
</template>

<script>
import { ref, onUpdated, getCurrentInstance } from "vue";
import { auditPassedApi } from "@api";
export default {
  emits: ["clonse"],
  props: {
    messageDetail: Object,
  },
  setup(props, { emit }) {
    const orderDetailRef = ref(null);
    const { proxy } = getCurrentInstance();
    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("clonse");
      }, 400);
    };
    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });
    const handleAuditClick = (bol) => {
      const status = bol ? "success" : "failed";
      auditPassed(props.messageDetail.id, status);
    };
    const auditPassed = async (denom_id, status) => {
      const { err_code } = await auditPassedApi({ denom_id, status });
      if (err_code === "0") {
        emit("clonse",'refresh',props.messageDetail.id);
      }
    };
    return {
      handleHideClick,
      orderDetailRef,
      joinPreviewUrl: proxy.joinPreviewUrl,
      handleAuditClick,
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
  overflow-y: auto;
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
    margin: 0;
    padding: 0;
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
    margin-top: 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }

  .audit-box {
    position: sticky;
    bottom: 10px;
    right: 0;
    transform: translateX(0);
    display: flex;
    justify-content: center;
    div {
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      margin-left: 10px;
      color: #fff;
      border: none;
      cursor: pointer;
      background: #54a44b;
      border-radius: 8px;
    }
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
