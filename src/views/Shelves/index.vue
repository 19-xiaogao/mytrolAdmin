<template>
  <div class="shelves">
    <div class="top">
      <UploadNft v-model:doneImgFile="nft_file" ref="uploadNft" />
      <div class="user_search">
        <div class="search-title">
          <input placeholder="在此输入标题" v-model="name" />
          <a-dropdown class="serial-number" v-model="series_ip">
            <template #overlay>
              <a-menu>
                <a-menu-item key="">
                  首页
                </a-menu-item>
                <a-menu-item v-for="item in ipList" :key="item">
                  {{ item.name }}
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <span>首页</span>
              <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg>
            </a-button>
          </a-dropdown>
        </div>
        <div class="search-base">
          <div class="avator">
            <div class="header">
              <img src="@assets/images/avtor.png" alt="" />
              <p>Jason</p>
            </div>
            <div
              class="icon"
              @click="() => handleHeaderSelectClick(true)"
            ></div>
          </div>
          <div class="price">
            <div>价格</div>
            <input v-model="price" type="number" placeholder="设定价格" />
          </div>
          <div class="price">
            <div>限量</div>
            <input v-model="number" type="number" placeholder="请输入数量" />
          </div>
          <div class="price">
            <div>开售时间</div>
            <a-date-picker
              show-time
              placeholder="Select Time"
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
              <span>Jason</span>
            </div>
          </div>
        </div>
        <div class="ups">
          <div class="nft-des">
            <textarea placeholder="在此输入藏品描述" v-model="description" />
            <h3>NFT介绍</h3>
          </div>
          <UploadCollection
            ref="uploadCollection"
            v-model:nft_background="nft_background"
          />
        </div>
      </div>
    </div>
    <div class="btns">
      <div class="btn" @click="handleUploadNftClick">
        <icon-svg icon="icon-icon4" class="icon"></icon-svg>
        <span>上架</span>
      </div>
    </div>
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
} from "vue";
import UploadNft from "./UploadNft";
import UploadCollection from "./UploadCollection";
import { getSerisesIpApi, uploadNftApi } from "@api";
import dayjs from "dayjs";

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

export default defineComponent({
  components: {
    UploadNft,
    UploadCollection,
  },
  setup() {
    let uploadParams = reactive(obj);
    const { proxy } = getCurrentInstance();
    const ipList = ref([]);

    onMounted(() => {
      getIpList();
    });

    const getIpList = async () => {
      const { err_code, result } = await getSerisesIpApi();
      if (err_code === "0") {
        console.log("ipList", result);
        ipList.value = result;
      }
    };

    const showHeaderSelect = ref(false);
    const handleUploadNftClick = async () => {
      if (!uploadParams.name.trim())
        return window.$message.warn({
          message: "提示",
          description: "请输入标题",
        });
      if (!uploadParams.description.trim())
        return window.$message.warn({
          message: "提示",
          description: "请输入藏品描述",
        });
      if (!uploadParams.number)
        return window.$message.warn({
          message: "提示",
          description: "请输入数量",
        });
      if (!uploadParams.price)
        return window.$message.warn({
          message: "提示",
          description: "请输入价格",
        });
      if (!uploadParams.opening_time)
        return window.$message.warn({
          message: "提示",
          description: "请输入开售时间",
        });
      if (!Object.keys(uploadParams.nft_file))
        return window.$message.warn({
          message: "提示",
          description: "请输入数字产品",
        });

      const temporaryObj = {
        ...uploadParams,
        opening_time: `${dayjs(uploadParams.opening_time).unix()}`,
      };
      const formData = new FormData();

      for (let key in temporaryObj) {
        formData.append(key, uploadParams[key]);
      }
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
        proxy.$refs.uploadNft.imgSrc = "";
        proxy.$refs.uploadCollection.imgSrc = "";
        window.$message.success({ message: "提示", description: "上架成功" });
      }
    };

    const handleHeaderSelectClick = (boolan) => {
      showHeaderSelect.value = boolan;
    };

    return {
      ...toRefs(uploadParams),
      handleUploadNftClick,
      handleHeaderSelectClick,
      showHeaderSelect,
      ipList,
    };
  },
});
</script>

<style lang="scss" scoped>
.serial-number {
  width: 87px;
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
          div {
            padding-left: 40px;
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
            font-weight: 500;
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
            padding: 20px;
            padding-top: 44px;
            display: inline-block;
            width: 100%;
            height: 100%;
            font-size: 16px;
            color: #000000;
          }
          h3 {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 19px;
            color: #000;
            font-weight: 600;
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
