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
        <icon-svg
          icon="icon-tianjia"
          class="icon"
          @click="handleHideClick"
        ></icon-svg>
        <p>卡片尺寸1002*602，图片内容需要按照模版尺寸和元素</p>
        <input
          type="file"
          class="upload-file"
          @change="handleEquityCoverChange"
        />
        <img
          v-if="equityParams.equityCover.value"
          :src="equityParams.equityCover.value"
          alt=""
        />
      </div>
    </div>
    <div class="add-equity-box">
      <h3>权益卡内容</h3>
      <div class="equity-cover">
        <icon-svg
          icon="icon-tianjia"
          class="icon"
          @click="handleHideClick"
        ></icon-svg>
        <p style="width: 249px">
          详情尺寸宽1052px，高度没有限制，图片内容需要按照模版尺寸和元素
        </p>
        <input
          type="file"
          class="upload-file"
          @change="handleEquityContentChange"
        />
        <img
          v-if="equityParams.equityContent.value"
          :src="equityParams.equityContent.value"
          alt=""
        />
      </div>
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
import { ref, onUpdated, reactive } from "vue";
import {
  warningNotify,
  previewFile,
  uuidToCreateHash,
  backFileType,
} from "@/utils";
import { uploadAliOssApi } from "@api";
export default {
  emits: ["close"],
  props: {
    nftNumber: [Number, String],
  },
  setup(props, { emit }) {
    const orderDetailRef = ref(null);
    const loading = ref(false);
    const equityParams = reactive({
      equityCover: {
        value: "",
        type: "",
      },
      equityContent: {
        value: "",
        type: "",
      },
    });
    const formData = new FormData();
    formData.append("equityCover", "");
    formData.append("equityContent", "");
    const handleHideClick = () => {
      orderDetailRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
      setTimeout(() => {
        emit("close");
      }, 400);
    };
    const uploadFileAllOss = () => {
      const equityCoverFilName = `item/equityCover${uuidToCreateHash()}.${
        equityParams.equityCover.type
      }`;
      const equityContentFileName = `item/equityContent${uuidToCreateHash()}.${
        equityParams.equityContent.type
      }`;
      return new Promise((resolve, reject) => {
        Promise.all([
          uploadAliOssApi(equityCoverFilName, formData.get("equityCover")),
          uploadAliOssApi(equityContentFileName, formData.get("equityContent")),
        ])
          .then((result) => {
            console.log(result);
            resolve({
              equityCover: result[0].res.requestUrls[0],
              equityContent: result[1].res.requestUrls[0],
            });
          })
          .catch((err) => reject(err));
      });
    };
    const initData = () => {
      equityParams.equityCover = {
        value: "",
        type: "",
      };
      equityParams.equityContent = {
        value: "",
        type: "",
      };
    };
    const handleSaveSettingClick = async () => {
      if (!equityParams.equityCover.value.trim().length === 0) {
        return warningNotify("请上传权益封面");
      }
      if (!equityParams.equityContent.value.trim().length === 0) {
        return warningNotify("请上传权益内容");
      }
      loading.value = true;
      const result = await uploadFileAllOss();
      loading.value = false;
      emit("close", result);
      initData();
    };

    const handleEquityCoverChange = (e) => {
      const file = e.target.files;
      previewFile(file[0]).then((res) => {
        equityParams.equityCover.type = backFileType(file[0]);
        equityParams.equityCover.value = res;
        formData.set("equityCover", file[0]);
      });
    };
    const handleEquityContentChange = (e) => {
      const file = e.target.files;
      previewFile(file[0]).then((res) => {
        equityParams.equityContent.type = backFileType(file[0]);
        equityParams.equityContent.value = res;
        formData.set("equityContent", file[0]);
      });
    };

    onUpdated(() => {
      orderDetailRef.value.style.animation = "sliding-show 0.5s linear 0s";
    });

    return {
      handleHideClick,
      orderDetailRef,
      handleSaveSettingClick,
      equityParams,
      handleEquityCoverChange,
      handleEquityContentChange,
      loading,
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
    .equity-cover {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 16px;
      background: #f1f1f1;
      .icon {
        position: absolute;
        font-size: 40px;
        font-weight: 600;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      p {
        position: absolute;
        font-size: 40px;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 223px;
        height: 52px;
        font-size: 14px;
        text-align: center;
        font-weight: 400;
        color: #979797;
      }
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        object-fit: cover;
        object-position: center center;
      }
      .upload-file {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        top: 0;
        left: 0;
        cursor: pointer;
        overflow: hidden;
        z-index: 11;
      }
    }
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
