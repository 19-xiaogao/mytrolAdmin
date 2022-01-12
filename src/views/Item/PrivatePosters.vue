<template>
  <a-modal :footer="null" :visible="postersVisible" class="modal" title="作品管理" width="45%">
    <div class="modal-body">
      <div class="item-qr-Code">
        <p>藏品二维码</p>
        <div class="item-qr-code-img">
          <img alt="" src="@/assets/images/order-detail-img.jpg">
        </div>
      </div>
      <div class="item-conversion-code">
        <div class="c-code">
          <p>藏品兑换码</p>
          <div class="input-box">
            <input type="text" value="https://www.baidu.com">
            <icon-svg class="icon" icon="icon-fuzhi"></icon-svg>
          </div>
        </div>
        <div class="posters-btns">
          <div class="excel-btn">
            <icon-svg icon="icon-xiazai"></icon-svg>
            下载Excel兑换表
          </div>
          <div class="excel-btn">
            <icon-svg icon="icon-xiazai"></icon-svg>
            下载海报
          </div>
        </div>
      </div>
    </div>

    <template #closeIcon>
      <div class="close" @click="handleClose">取消</div>
    </template>
  </a-modal>
</template>

<script>
import {defineComponent} from "vue";
import IconSvg from "@/components/IconSvg";

export default defineComponent({
  components: {IconSvg},
  props: {
    postersVisible: {
      type: Boolean,
    },
  },
  setup(props, {emit}) {


    const handleClose = () => {
      emit("update:postersVisible")
    };

    return {
      handleClose,
    };
  },
});
</script>

<style lang="scss" scoped>
.close {
  font-weight: 400;
  color: #bcbcbc;
  cursor: pointer;
}

.modal-body {
  display: flex;
  justify-content: space-between;

  .item-qr-Code {
    margin-right: 20px;
    p {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
    }

    .item-qr-code-img {
      height: 370px;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .item-conversion-code {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .c-code {
      p {
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }

      .input-box {
        position: relative;
        width: 242px;
        input {
          width: 100%;
          height: 50px;
          background: #F7F7F7;
          border-radius: 8px;
          padding-left: 10px;
          padding-right: 20px;
        }

        .svg-icon {
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          font-size: 20px;
          cursor: pointer;
        }

      }
    }

    .posters-btns {
      .excel-btn {
        width: 242px;
        height: 40px;
        background: #F6F6F6;
        border-radius: 12px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }

      & .excel-btn:nth-child(2) {
        margin-top: 10px;
      }

    }
  }
}

</style>
