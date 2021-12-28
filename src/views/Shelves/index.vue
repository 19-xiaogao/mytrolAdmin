<template>
  <div class="shelves">
    <div class="top">
      <div class="upload-img-box">
        <UploadNft
          v-model:doneImgFile="nft_file"
          v-model:doneImgType="nftAllImgType.nft_file_type"
          ref="uploadNftRef"
          type="originalImage"
          @previewImgClick="handleUploadNftPreview"
        />
        <UploadNft
          v-model:doneImgFile="nft_thumbnail"
          v-model:doneImgType="nftAllImgType.nft_thumbnail_type"
          ref="nftThumbnailRef"
          style="margin-top: 10px"
          type="thumbnail"
          @previewImgClick="handleUploadNftPreview"
        />
      </div>

      <div class="user_search">
        <div class="search-title">
          <a-input
            placeholder="在此输入作品名称(50字以内)"
            v-model:value="name"
          />
          <a-dropdown class="serial-number">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key=""> 首页 </a-menu-item>
                <a-menu-item v-for="item in ipList" :key="item.name">
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <span>{{ currentIpName }}</span>
              <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg>
            </a-button>
          </a-dropdown>
        </div>
        <div class="search-base">
          <div class="avator"></div>
          <div class="price">
            <div>价格</div>
            <a-input-number
              v-model:value="price"
              type="number"
              style="width: 150px"
              placeholder="设定价格"
            />
          </div>
          <div class="price">
            <div>限量</div>
            <a-input-number
              v-model:value="number"
              type="number"
              :max="100000"
              :min="0.01"
              style="width: 150px"
              placeholder="请输入数量"
            />
          </div>
          <div class="price">
            <div>设置分类</div>
            <a-select
              class="select"
              placeholder="请选择分类"
              mode="multiple"
              v-model:value="classification"
            >
              <a-select-option
                v-for="item in classData"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </div>
          <div class="price">
            <div>开售时间</div>
            <a-date-picker
              show-time
              placeholder="请选择时间"
              class="date-picker"
              v-model:value="opening_time"
              :bordered="false"
            />
          </div>
        </div>
        <div class="ups">
          <div class="nft-des">
            <p>NFT介绍</p>
            <textarea
              placeholder="在此输入藏品描述(建议200字以内)"
              v-model="description"
            />
          </div>
          <UploadCollection
            ref="uploadCollection"
            v-model:nft_background="nft_background"
            v-model:doneImgType="nftAllImgType.nft_background_type"
            @previewImgClick="handleUploadNftPreview"
          />
        </div>
        <div class="ope-act-b-l">
          <div class="opeAct-button" @click="handleEquityActivityClick">
            <icon-svg icon="icon-a-bianzu34"></icon-svg>
            <icon-svg icon="icon-duihao"></icon-svg>
            添加权益卡
          </div>
          <div class="opeAct-button" @click="handleShowOperationActivityClick">
            <icon-svg icon="icon-qizi" class="icon"></icon-svg>
            运营活动
          </div>
          <div class="ope-tag" v-if="free_number">限量免费</div>
          <div class="ope-tag" v-if="private_sale">私人发售</div>
        </div>
      </div>
    </div>
    <div class="btns">
      <a-button
        class="btn"
        @click="handleUploadNftClick"
        :loading="btnDisabled"
      >
        <template #icon>
          <icon-svg icon="icon-icon4" class="icon"></icon-svg
        ></template>
        <span>创作</span>
      </a-button>
    </div>

    <PreviewImg
      :imgUrl="priviesImgComponentParams.imgUrl"
      v-model:visible="priviesImgComponentParams.visible"
    />
    <OperationActivity
      v-show="isOperationActivity"
      :nftNumber="number"
      @close="handleOperationActivityClick"
    />
    <EquityActivity
      v-show="isEquityActivity"
      @close="handleCloseEquityActivityClick"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {
  getSerisesIpApi,
  uploadNftApi,
  getClassificationApi,
  uploadAliOssApi,
} from "@api";
import dayjs from "dayjs";
import UploadNft from "./UploadNft";
import { warningNotify, successNotify, uuidToCreateHash } from "@/utils";
import UploadCollection from "./UploadCollection";
import PreviewImg from "@/components/PreviewImg";
import OperationActivity from "./OperationActivity";
import EquityActivity from "./EquityActivity.vue";

let shelvesParams = {
  name: "",
  description: "",
  number: "",
  series_ip: "",
  price: "",
  opening_time: "",
  nft_file: {},
  nft_background: {},
  nft_thumbnail: {},
  free_number: "",
  private_sale: "",
  classification: [],
};
export default defineComponent({
  components: {
    UploadNft,
    UploadCollection,
    PreviewImg,
    OperationActivity,
    EquityActivity,
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const ipList = ref([]);
    const classData = ref([]);
    const currentIpName = ref("首页");
    const priviesImgComponentParams = reactive({
      imgUrl: "",
      visible: false,
    });
    const uploadParams = reactive(shelvesParams);
    const nftAllImgType = reactive({
      nft_file_type: "",
      nft_background_type: "",
      nft_thumbnail_type: "",
    });
    const btnDisabled = ref(false);
    const isOperationActivity = ref(false);
    const isEquityActivity = ref(false);
    onMounted(() => {
      getIpList();
      getClassData();
    });
    onUnmounted(() => {
      initParams();
    });
    const handleUploadNftPreview = (imgSrc) => {
      priviesImgComponentParams.imgUrl = imgSrc;
      priviesImgComponentParams.visible = true;
    };
    const getIpList = async () => {
      const { err_code, result } = await getSerisesIpApi();
      if (err_code === "0") {
        if (!result) return;
        ipList.value = result.filter((item) => item.status === "on");
      }
    };
    const getClassData = async () => {
      const { result, err_code } = await getClassificationApi();
      if (err_code === "0") {
        classData.value = result;
      }
    };
    const initParams = () => {
      uploadParams.name = "";
      uploadParams.description = "";
      uploadParams.number = "";
      uploadParams.series_ip = "";
      uploadParams.price = "";
      uploadParams.opening_time = "";
      uploadParams.nft_file = {};
      uploadParams.nft_background = {};
      uploadParams.nft_thumbnail = {};
      uploadParams.free_number = "";
      uploadParams.private_sale = "";
      uploadParams.classification = [];
      currentIpName.value = "首页";
      btnDisabled.value = false;
    };

    const uploadAllNftToOssApi = (formData) => {
      const hash = uuidToCreateHash();
      const nft_file = formData.get("nft_file");
      const nft_background = formData.get("nft_background");
      const nft_thumbnail = formData.get("nft_thumbnail");

      const nft_file_name = `item/nftFile${hash}.${nftAllImgType.nft_file_type}`;
      const nft_background_name = `item/nftBackground${hash}.${nftAllImgType.nft_background_type}`;
      const nft_thumbnail_name = `item/nftThumbnail${hash}.${nftAllImgType.nft_thumbnail_type}`;

      return new Promise((resolve, reject) => {
        Promise.all([
          uploadAliOssApi(nft_file_name, nft_file),
          uploadAliOssApi(nft_background_name, nft_background),
          uploadAliOssApi(nft_thumbnail_name, nft_thumbnail),
        ])
          .then((result) => {
            resolve({
              nft_file: result[0].res.requestUrls[0],
              nft_background: result[1].res.requestUrls[0],
              nft_thumbnail: result[2].res.requestUrls[0],
            });
          })
          .catch((err) => reject(err));
      });
    };

    const setFormDateNft = (formData, obj) => {
      formData.set("nft_file", obj.nft_file);
      formData.set("nft_background", obj.nft_background);
      formData.set("nft_thumbnail", obj.nft_thumbnail);
    };

    const handleUploadNftClick = async () => {
      btnDisabled.value = true;
      const userSelectTime = dayjs(uploadParams.opening_time).unix();
      if (userSelectTime < dayjs(Date.now()).unix()) {
        return warningNotify("请选择正确的开售时间，当前你选择的时间已过。");
      }
      if (!uploadParams.name.trim()) {
        warningNotify("请输入作品名称");
        return (btnDisabled.value = false);
      }
      if (uploadParams.name.trim().length >= 50) {
        warningNotify("作品名称过长,50字以内");
        return (btnDisabled.value = false);
      }

      if (!uploadParams.description.trim()) {
        warningNotify("请输入描述");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.number) {
        warningNotify("请输入输入数量");
        return (btnDisabled.value = false);
      }
      if (Number(uploadParams.number) <= 0) {
        warningNotify("数量不能小于或等于0");
        return (btnDisabled.value = false);
      }
      // nft 创作的数量小于10张
      if (Number(uploadParams.number) >= 100000) {
        warningNotify("创作的数量应小于10万张");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.price) {
        warningNotify("请输入价格");
        return (btnDisabled.value = false);
      }
      if (uploadParams.classification.length === 0) {
        warningNotify("请选择分类");
        return (btnDisabled.value = false);
      }
      if (Number(uploadParams.price) < 0) {
        warningNotify("价格不能小于0");
        return (btnDisabled.value = false);
      }
      if (Number(uploadParams.price) < 0.01) {
        warningNotify("价格不能小于一分钱");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.opening_time) {
        warningNotify("请选择上架时间");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.nft_file.size) {
        warningNotify("请上传数字藏品");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.nft_background.size) {
        warningNotify("请上传藏品描述图片");
        return (btnDisabled.value = false);
      }
      if (!uploadParams.nft_thumbnail.size) {
        warningNotify("请上传缩略图");
        return (btnDisabled.value = false);
      }
      const formData = new FormData();

      uploadParams.classification = uploadParams.classification.join();

      for (let key in uploadParams) {
        formData.append(key, uploadParams[key]);
      }
      if (!uploadParams.nft_background.size) {
        formData.set("nft_background", "");
      }
      formData.set("opening_time", String(userSelectTime));

      const ossResult = await uploadAllNftToOssApi(formData);
      setFormDateNft(formData, ossResult);

      const { err_code } = await uploadNftApi(formData, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      if (err_code === "0") {
        initParams();
        proxy.$refs.uploadNftRef.imgSrc = "";
        proxy.$refs.uploadCollection.imgSrc = "";
        proxy.$refs.nftThumbnailRef.imgSrc = "";
        successNotify("创作成功，请等待审核通过。区块上链中...");
      }
    };
    const handleMenuClick = (e) => {
      uploadParams.series_ip = e.key;
      const findName = ipList.value.find((item) => item.name === e.key);
      currentIpName.value = findName ? findName.name : "首页";
    };
    const handleOperationActivityClick = (item) => {
      isOperationActivity.value = false;
      if (item) {
        uploadParams.free_number = item.free_number;
        uploadParams.private_sale = item.private_sale;
      }
    };
    const handleShowOperationActivityClick = () => {
      isOperationActivity.value = true;
    };
    const handleEquityActivityClick = () => {
      isEquityActivity.value = true;
    };

    const handleCloseEquityActivityClick = () => {
      isEquityActivity.value = false;
    };

    return {
      ...toRefs(uploadParams),
      handleUploadNftClick,
      ipList,
      handleMenuClick,
      currentIpName,
      handleUploadNftPreview,
      priviesImgComponentParams,
      btnDisabled,
      isOperationActivity,
      handleOperationActivityClick,
      classData,
      handleShowOperationActivityClick,
      isEquityActivity,
      handleEquityActivityClick,
      handleCloseEquityActivityClick,
      nftAllImgType,
    };
  },
});
</script>

<style lang="scss" scoped>
.serial-number {
  height: 34px;
  border-radius: 6px;
  border: 1px solid #cacaca;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  cursor: pointer;

  .icon {
    font-size: 1rem;
    margin-left: 4px;
  }
  span {
    font-size: 14px;
    color: #000;
    font-weight: 400;
  }
}
.shelves {
  box-sizing: border-box;
  padding: 30px 23px;
  background: #fff;
  height: 89.59vh;
  position: relative;
  .top {
    display: flex;
    .user_search {
      flex: 1;
      text-align: left;
      margin-left: 42px;

      .search-title {
        height: 34px;
        width: 100%;
        font-size: 24px;
        font-weight: 600;
        color: #2d2d2d;
        display: flex;
        input {
          display: inline-block;
          width: 100%;
          border: 1px solid #eee;
          border-radius: 10px;
          margin-right: 10px;
          padding: 10px;
          box-sizing: border-box;
          font-size: 16px;
        }
      }
      .search-base {
        width: 100%;
        height: 118px;
        background: #f7f7f7;
        border-radius: 8px;
        margin-top: 5px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .avator {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-right: 4px;
          margin-left: 30px;
          margin-top: 20px;
          .header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
              display: inline-block;
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .icon {
            margin-left: 9px;
            margin-bottom: 20px;
            width: 0;
            height: 0;
            overflow: hidden;
            border-radius: 4px;
            border-width: 8px;
            border-style: solid;
            cursor: pointer;
            border-color: #686868 transparent transparent transparent;
          }
        }
        .price {
          display: flex;
          flex-direction: column;
          padding-right: 20px;
          div {
            text-align: center;
            font-size: 18px;
            color: #434343;
          }
          .date-picker {
            // font-size: 16px;
            // width: 90%;
            font-weight: 500;
            border: none;
            color: #000000;
            &::-webkit-input-placeholder {
              color: #999;
            }

            // text-indent: 1rem;
            border-radius: 4px;
            background-color: #fff;

            display: inline-block;
          }
          input {
            font-size: 16px;
            width: 90%;
            // font-weight: 500;
            color: #000000;
            &::-webkit-input-placeholder {
              color: #999;
            }

            text-indent: 1rem;
            border-radius: 4px;
            background-color: #fff;

            display: inline-block;
          }
          .select {
            width: 200px;
          }
        }
        .select-headers {
          position: absolute;
          left: 27px;
          bottom: -93px;
          background: #ffffff;
          box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.16);
          border-radius: 8px;
          padding: 16px;
          box-sizing: border-box;
          display: flex;
          animation: upShow 0.3s ease-in;
          z-index: 111;
          .header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            border-radius: 8px;
            box-sizing: border-box;
            width: 70px;
            height: 70px;
            cursor: pointer;
            margin-left: 23px;
            img {
              display: inline-block;
              width: 34px;
              height: 34px;
              border-radius: 50%;
            }
            &:hover {
              background: #f7f7f7;
            }
            span {
              color: #000000;
              font-size: 14px;
            }
          }
        }
      }
      @keyframes upShow {
        0% {
          transform: translateY(-30px);
          opacity: 0.4;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes dowShow {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-30px);
          opacity: 0.4;
        }
      }
      .ups {
        display: flex;
        margin-top: 16px;
        .nft-des {
          width: 40%;
          border-radius: 8px;
          border: 1px solid #f3f1f1;
          height: calc(470px - 16px - 118px - 5px - 34px);
          position: relative;
          textarea {
            padding: 5px 5px 5px 20px;
            display: inline-block;
            width: 100%;
            height: calc(100% - 50px);
            font-size: 16px;
            color: #000000;
            box-sizing: border-box;
          }
          p {
            margin: 0;
            padding: 0;
            font-size: 19px;
            color: #000;
            font-weight: 600;
            margin-left: 20px;
            margin-top: 10px;
          }
        }
      }
      .ope-act-b-l {
        display: flex;
        margin-top: 24px;
      }
      .opeAct-button {
        width: 134px;
        height: 40px;
        background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        text-align: center;
        line-height: 40px;
        margin: 0 10px;

        cursor: pointer;
        .icon {
          background: #fff;
          color: #eba030;
          border-radius: 40%;
          font-weight: 800;
        }
      }
      .ope-tag {
        width: 106px;
        height: 40px;
        border-radius: 8px;
        border: 1px dashed #979797;
        font-size: 16px;
        font-weight: 500;
        color: #434343;
        text-align: center;
        line-height: 40px;
        margin: 0 10px;
      }
    }
  }

  .btns {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .btn {
      width: 242px;
      height: 48px;
      background: #54a44b;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 2rem;
        color: #fff;
      }
      span {
        color: #ffffff;
        font-size: 16px;
        padding-top: 4px;
        font-weight: 500;
      }
    }

    & :nth-child(1) {
      margin-right: 20px;
    }
  }
}
</style>
