<template>
  <div class="operation-activity" ref="orderDetailRef">
    <div class="header">
      <span class="title">运营活动</span>
      <icon-svg
        icon="icon-a-bianzu101"
        class="icon"
        @click="handleHideClick"
      ></icon-svg>
    </div>
    <div class="limit-time-free">
      <p class="free-title">限量免费</p>
      <input
        type="number"
        placeholder="输入前多少份作品免费"
        v-model="free_number"
      />
    </div>
    <div class="private-sale">
      <div class="private-sale-is">
        <span class="p-title">私人发售</span>
        <a-switch
          checked-children="开"
          un-checked-children="关"
          default-checked
          v-model:checked="checked"
        />
      </div>
      <p class="decs">
        私人发售作品，只有通过访问特定链接才能观看藏品详情和购买
      </p>
    </div>
    <div class="save-setting" @click="handleSaveSettingClick">
      <icon-svg icon="icon-save"></icon-svg>
      保存设置
    </div>
  </div>
</template>

<script>
import { ref, onUpdated } from "vue";
import { warningNotify } from "@/utils";
export default {
  emits: ["close"],
  props: {
    nftNumber: [Number, String],
  },
  setup(props, { emit }) {
    const orderDetailRef = ref(null);
    const checked = ref(false);
    const free_number = ref(0);
    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("close");
      }, 400);
    };
    const handleSaveSettingClick = () => {
      if (free_number.value <= 0) {
        return warningNotify("请输入大于0的数量");
      }
      if (typeof props.nftNumber !== "number" || props.nftNumber <= 0) {
        return warningNotify("请先输入nft创作的数量");
      }
      if (free_number.value > props.nftNumber) {
        return warningNotify("免费的数量不能大于创作NFT的数量");
      }
      emit("close", {
        free_number: free_number.value,
        private_sale: checked.value,
      });
      
    };
    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });

    return {
      handleHideClick,
      orderDetailRef,
      checked,
      free_number,
      handleSaveSettingClick,
    };
  },
};
</script>
<style lang="scss" scoped>
.operation-activity {
  position: absolute;
  right: 10px;
  top: 4px;
  width: 390px;
  height: calc(100% - 4px);
  background: #ffffff;
  overflow-y: auto;
  box-shadow: -6px 0px 18px 0px rgba(107, 107, 107, 0.16);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 0 21px;
  animation: sliding-show 0.5s linear 0s;
  z-index: 11;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    left: 0;
    background: #fff;
    height: 50px;
    width: 105%;
    .title {
      font-size: 18px;
      font-weight: 500;
      color: #000000;
    }
    .icon {
      font-size: 1.6rem;
      cursor: pointer;
    }
  }
  .limit-time-free {
    margin-top: 12px;
    position: relative;
    .free-title {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
    }
    input {
      width: 100%;
      height: 50px;
      background: #f7f7f7;
      border-radius: 8px;
      padding-left: 16px;
      font-size: 16px;
      padding-right: 50px;
    }
    .icon-copy {
      position: absolute;
      font-size: 30px;
      top: 56%;
      right: 20px;
      cursor: pointer;
    }
  }
  .private-sale {
    margin-top: 30px;
    .private-sale-is {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .p-title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        margin-top: 10px;
      }
    }
    .decs {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
      padding: 0;
      color: #cacaca;
    }
  }
  .goods-qr-code {
    margin-top: 10px;
    text-align: center;
    .good-header {
      display: flex;
      justify-content: space-between;
      .good-title {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
      }
      .good-icon {
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .qr-code {
      width: 226px;
      height: 226px;
      margin-top: 4px;
    }
  }

  .save-setting {
    width: 134px;
    height: 40px;
    background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    position: absolute;
    bottom: 10px;
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
