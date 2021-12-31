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
    <div class="add-box">
      <UploadEquityImg
        uploadName="权益卡封面"
        ref="cover"
        @uploadDone="handleEquityCoverDone"
      />
      <UploadEquityImg
        uploadName="权益卡内容"
        ref="content"
        @uploadDone="handleEquityContentDone"
      />
      <UploadEquityImg
        uploadName="权益卡二维码"
        ref="code"
        @uploadDone="handleEquityQrCodeDone"
      />
    </div>
    <a-button
      class="save-setting"
      @click="handleSaveSettingClick"
      :loading="loading"
    >
      <icon-svg icon="icon-save"></icon-svg>
      添加
    </a-button>
  </div>
</template>

<script>
import { ref, onUpdated, reactive, getCurrentInstance } from "vue";
import { uploadAliOssApi } from "@api";
import { warningNotify, uuidToCreateHash } from "@/utils";
import UploadEquityImg from "./UploadEquityImg";

export default {
  emits: ["close"],
  components: {
    UploadEquityImg,
  },
  props: {
    nftNumber: [Number, String],
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    const orderDetailRef = ref(null);
    const loading = ref(false);

    const equityParams = reactive({
      equity_cover: {
        value: "",
        type: "",
      },
      equity_content: {
        value: "",
        type: "",
      },
      qr_code: {
        value: "",
        type: "",
      },
    });

    const formData = new FormData();
    formData.append("equity_cover", "");
    formData.append("equity_content", "");
    formData.append("qr_code", "");

    const initData = () => {
      proxy.$refs.cover.file.value = "";
      proxy.$refs.cover.file.type = "";

      proxy.$refs.content.file.value = "";
      proxy.$refs.content.file.type = "";

      proxy.$refs.code.file.value = "";
      proxy.$refs.code.file.type = "";
    };

    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("close");
      }, 400);
    };

    const uploadFileAllOss = async () => {
      const callBackObj = {
        equity_cover: "",
        equity_content: "",
        qr_code: "",
      };
      if (formData.get("equity_cover")) {
        const fileName = `item/equity_cover${uuidToCreateHash()}.${
          equityParams.equity_cover.type
        }`;
        const result = await uploadAliOssApi(
          fileName,
          formData.get("equity_cover")
        );
        callBackObj.equity_cover = result.res.requestUrls[0];
      }
      if (formData.get("equity_content")) {
        const fileName = `item/equity_cover${uuidToCreateHash()}.${
          equityParams.equity_content.type
        }`;
        const result = await uploadAliOssApi(
          fileName,
          formData.get("equity_content")
        );
        callBackObj.equity_content = result.res.requestUrls[0];
      }
      if (formData.get("qr_code")) {
        const fileName = `item/qr_code${uuidToCreateHash()}.${
          equityParams.qr_code.type
        }`;
        const result = await uploadAliOssApi(fileName, formData.get("qr_code"));
        callBackObj.qr_code = result.res.requestUrls[0];
      }
      return callBackObj;
    };

    const handleSaveSettingClick = async () => {
      if (!equityParams.equity_cover.value) {
        return warningNotify("请上传权益封面");
      }

      loading.value = true;
      const result = await uploadFileAllOss();
      loading.value = false;
      emit("close", result);
    };

    const handleEquityCoverDone = (file, type) => {
      equityParams.equity_cover.type = type;
      equityParams.equity_cover.value = file;
      formData.set("equity_cover", file);
    };

    const handleEquityContentDone = (file, type) => {
      equityParams.equity_content.type = type;
      equityParams.equity_content.value = file;
      formData.set("equity_content", file);
    };

    const handleEquityQrCodeDone = (file, type) => {
      equityParams.qr_code.type = type;
      equityParams.qr_code.value = file;
      formData.set("qr_code", file);
    };

    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });

    return {
      handleHideClick,
      orderDetailRef,
      handleSaveSettingClick,
      equityParams,
      loading,
      handleEquityCoverDone,
      handleEquityContentDone,
      handleEquityQrCodeDone,
      initData,
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
  .add-box {
    height: 90%;
    overflow-y: auto;
  }

  .save-setting {
    width: 134px;
    height: 40px;
    background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    line-height: 20px;
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
