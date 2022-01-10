<template>
  <div ref="orderDetailRef" class="order-detail">
    <div class="header">
      <img alt="" class="mytrolLogo" src="@assets/images/mytrolLogo.png"/>
      <icon-svg
          class="icon"
          icon="icon-a-bianzu101"
          @click="handleHideClick"
      ></icon-svg>
    </div>
    <div class="avator">
      <img :src="messageDetail.avatar" alt=""/>
      <span>{{ messageDetail.nickname }}</span>
    </div>
    <p class="des">
      {{ messageDetail.name }}
    </p>
    <div class="ikon">
      <img :src="joinPreviewUrl(messageDetail.file)" alt=""/>
    </div>
    <div class="works-desc">
      <h3>作品介绍</h3>
      <p>Introduction of works</p>
    </div>
    <p class="des">{{ messageDetail.description }}</p>
    <div class="ikon">
      <img :src="joinPreviewUrl(messageDetail.file_background)" alt=""/>
    </div>
    <div class="audit-box">
      <div @click="handleAuditClick(true)">
        <icon-svg class="icon" icon="icon-a-bianzu33"></icon-svg>
        <span>通过</span>
      </div>
      <div @click="handleAuditClick(false)">
        <icon-svg class="icon" icon="icon-x-circle-bold"></icon-svg>
        <span>不通过</span>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, onUpdated, ref} from "vue";
import {auditPassedApi} from "@api";
import {errorNotify} from "@/utils";

export default {
  emits: ["clonse"],
  props: {
    messageDetail: Object,
  },
  setup(props, {emit}) {
    const {proxy} = getCurrentInstance();

    const orderDetailRef = ref(null);

    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });

    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("clonse");
      }, 400);
    };
    const handleAuditClick = (bol) => {
      const status = bol ? "success" : "failed";
      auditPassed(String(props.messageDetail.id), status);
    };
    const auditPassed = async (denom_id, status) => {
      const {err_code} = await auditPassedApi({
        denom_id: String(denom_id),
        status,
      });
      if (err_code === "0") {
        emit("clonse", "refresh", props.messageDetail.id);
      } else {
        errorNotify("审核失败,区块上链中...");
      }
    };
    return {
      orderDetailRef,
      joinPreviewUrl: proxy.joinPreviewUrl,
      handleAuditClick,
      handleHideClick,
    };
  },
};
</script>
<style lang="scss" scoped>
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
  padding: 0 21px;
  animation: sliding-show 0.5s linear 0s;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end !important;
    position: sticky;
    top: 0;
    left: 0;
    background: #fff;
    height: 50px;
    width: 105%;

    .mytrolLogo {
      margin-right: 80px;
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
    margin-top: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
  }

  .works-desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 22px;

    h3 {
      color: #434343;
      font-weight: 600;
      font-size: 20px;
    }

    p {
      margin: 0;
      padding: 0;
      font-weight: 600;
      color: #434343;
      font-size: 15px;
    }
  }

  .audit-box {
    position: sticky;
    bottom: 5px;
    right: 0;
    transform: translateX(0);
    display: flex;
    justify-content: center;

    div {
      width: 154px;
      height: 48px;
      background: #54a44b;
      border-radius: 8px;
      text-align: center;
      line-height: 48px;
      margin-left: 12px;
      color: #fff;
      border: none;
      cursor: pointer;
      color: #ffffff;
      border-radius: 8px;

      .icon {
        font-size: 1.2rem;
        margin-right: 10px;
      }

      &:first-child {
        background-color: #54a44b;
      }

      &:last-child {
        background-color: #ff451d;
      }
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
