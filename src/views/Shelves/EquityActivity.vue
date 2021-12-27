<template>
  <div class="operation-activity" ref="orderDetailRef">
    <div class="header">
      <span class="title">添加权益卡</span>
      <icon-svg
        icon="icon-a-bianzu101"
        class="icon"
        @click="handleHideClick"
      ></icon-svg>
    </div>
    <div class="add-equity-box">
      <h3>权益卡封面</h3>
      <div class="equity-cover">
          
      </div>
    </div>
    <div class="save-setting" @click="handleSaveSettingClick">
      <icon-svg icon="icon-save"></icon-svg>
      添加
    </div>
  </div>
</template>

<script>
import { ref, onUpdated, onMounted } from "vue";
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
    const currentSelectClass = ref([]);
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

    onMounted(() => {});
    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });

    return {
      handleHideClick,
      orderDetailRef,
      checked,
      free_number,
      handleSaveSettingClick,
      currentSelectClass,
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
  .add-equity-box {
    margin-top: 20px;
    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
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
