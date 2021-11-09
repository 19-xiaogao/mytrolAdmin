<template>
  <div class="shelves">
    <div class="top">
      <UploadNft
        v-model:doneImgFile="nft_file"
        ref="uploadNft"
        @previewImgClick="handleUploadNftPreview"
      />
      <div class="user_search">
        <div class="search-title">
          <a-input placeholder="在此输入标题" v-model:value="name" />
          <a-dropdown class="serial-number">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="">
                  首页
                </a-menu-item>
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
          <div class="avator">
            <div class="header">
              <img :src="personMessage.avatar" alt="" />
              <p>{{ personMessage.nickname }}</p>
            </div>
            <!-- <div
              class="icon"
              @click="() => handleHeaderSelectClick(true)"
            ></div> -->
          </div>
          <div class="price">
            <div>价格</div>
            <a-input-number
              v-model:value="price"
              type="number"
              style="width:150px;"
              placeholder="设定价格"
            />
          </div>
          <div class="price">
            <div>限量</div>
            <a-input-number
              v-model:value="number"
              type="number"
              style="width:150px;"
              placeholder="请输入数量"
            />
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
          <div class="select-headers" v-if="showHeaderSelect">
            <div
              class="header"
              v-for="item in [1, 2, 3, 4, 5]"
              :key="item"
              @click="() => handleHeaderSelectClick(false, item)"
            >
              <img src="@assets/images/avtor.png" alt="" />
              <span>JOSN</span>
            </div>
          </div>
        </div>
        <div class="ups">
          <div class="nft-des">
            <p>NFT介绍</p>
            <textarea placeholder="在此输入藏品描述" v-model="description" />
          </div>
          <UploadCollection
            ref="uploadCollection"
            v-model:nft_background="nft_background"
            @previewImgClick="handleUploadNftPreview"
          />
        </div>
      </div>
    </div>
    <div class="btns">
      <a-button class="btn" @click="handleUploadNftClick">
        <template #icon>
          <icon-svg icon="icon-icon4" class="icon"></icon-svg
        ></template>
        <span>上架</span>
      </a-button>
    </div>

    <PreviewImg
      :imgUrl="privewImgComponentParmas.imgUrl"
      v-model:visible="privewImgComponentParmas.visible"
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
  computed,
} from "vue";
import { useStore } from "vuex";
import { getSerisesIpApi, uploadNftApi } from "@api";
import dayjs from "dayjs";
import UploadNft from "./UploadNft";
import UploadCollection from "./UploadCollection";
import PreviewImg from "@/components/PreviewImg";

let obj = {
  name: "",
  description: "",
  number: "",
  series_ip: "",
  price: "",
  opening_time: "",
  nft_file: {},
  nft_background: {},
};
function warningNotify(description) {
  window.$message.warning({
    message: "抱歉~",
    description,
  });
}
export default defineComponent({
  components: {
    UploadNft,
    UploadCollection,
    PreviewImg,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    let uploadParams = reactive(obj);
    const ipList = ref([]);
    const currentIpName = ref("首页");
    const privewImgComponentParmas = reactive({
      imgUrl: "",
      visible: false,
    });
    onMounted(() => {
      getIpList();
    });
    const handleUploadNftPreview = (imgSrc) => {
      privewImgComponentParmas.imgUrl = imgSrc;
      privewImgComponentParmas.visible = true;
    };
    const personMessage = computed(() => store.getters.getPersonMessage);
    const getIpList = async () => {
      const { err_code, result } = await getSerisesIpApi();
      if (err_code === "0") {
        ipList.value = result;
      }
    };
    const showHeaderSelect = ref(false);

    const handleUploadNftClick = async () => {
      const userSelectTime = dayjs(uploadParams.opening_time).unix();
      if (userSelectTime < dayjs(Date.now()).unix() - 60 * 3) {
        return warningNotify("请选择正确的开售时间");
      }
      if (!uploadParams.name.trim()) return warningNotify("请输入标题");
      if (!uploadParams.description.trim()) return warningNotify("请输入描述");
      if (!uploadParams.number) return warningNotify("请输入输入数量");
      if (!uploadParams.price) return warningNotify("请输入价格");
      if (!uploadParams.opening_time) return warningNotify("请选择上架时间");
      if (!Object.keys(uploadParams.nft_file))
        return warningNotify("请上传数字藏品");

      const formData = new FormData();

      for (let key in uploadParams) {
        formData.append(key, uploadParams[key]);
      }
      formData.set("opening_time", String(userSelectTime));
      const { err_code } = await uploadNftApi(formData, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });

      if (err_code === "0") {
        uploadParams.name = "";
        uploadParams.description = "";
        uploadParams.number = "";
        uploadParams.series_ip = "";
        uploadParams.price = "";
        uploadParams.opening_time = "";
        uploadParams.nft_file = {};
        uploadParams.nft_background = {};
        currentIpName.value = "首页";
        proxy.$refs.uploadNft.imgSrc = "";
        proxy.$refs.uploadCollection.imgSrc = "";
        window.$message.success({ message: "提示", description: "上架成功" });
      }
    };

    const handleHeaderSelectClick = (boolan) => {
      showHeaderSelect.value = boolan;
    };
    const handleMenuClick = (e) => {
      uploadParams.series_ip = e.key;
      const findName = ipList.value.find((item) => item.name === e.key);
      currentIpName.value = findName ? findName.name : "首页";
      console.log(currentIpName.value);
    };
    return {
      ...toRefs(uploadParams),
      handleUploadNftClick,
      handleHeaderSelectClick,
      showHeaderSelect,
      ipList,
      handleMenuClick,
      currentIpName,
      personMessage,
      handleUploadNftPreview,
      privewImgComponentParmas,
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
          margin-right: 64px;
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
