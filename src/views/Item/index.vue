<template>
  <div class="ip-detail page-height">
    <div class="ip-detail-title">
      <div class="title-l">
        <div class="char">作品</div>
      </div>
      <div class="title-r">
        <TabBar :menuList="menuList" v-model:currentIndex="currentMenu" />
      </div>
    </div>
    <div class="ip-lists">
      <div
        class="card"
        @mouseover="() => handleMouseover(true, item.id)"
        @mouseout="() => handleMouseover(false, item.id)"
        v-for="item in renderWorksList"
        :key="item.id"
      >
        <div class="img" :ref="item.id">
          <img :src="item.file" alt="" />
        </div>
        <a-dropdown class="options" v-if="showOptionsElement(item.publish)">
          <p>
            <span class="text">设置</span>
            <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg>
          </p>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleShelvesClick(item.id, item.publish)">
                <span>{{ showSwitchShelves(item.publish) }}</span>
              </a-menu-item>
              <a-menu-item
                v-if="showQrCode(item.free, item.publish)"
                @click="handleQrCodeClick(item.id)"
              >
                <span>小程序二维码</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <div class="sale" v-if="showOpenTime(item)">
          <icon-svg icon="icon-naozhong" class="icon"></icon-svg>
          <span>
            {{
              dayjs(item.opening_time * 1000).format("YYYY-MM-DD HH:mm")
            }}</span
          >
        </div>

        <div class="me">
          <div class="me-t">
            <h3>{{ item.name }}</h3>
            <div class="avator-des">
              <div class="imgs">
                <img :src="item.author_avatar" alt="" />
                <img src="@assets/images/v-icon.png" class="icon" alt="" />
              </div>
              <span>{{ item.author_nickname }}</span>
            </div>
          </div>
          <div class="me-m">
            <div class="manay" v-if="showPrice(item.publish)">
              {{ showFreePrice(item.free, item.price) }}
            </div>

            <div class="_limit">
              <div class="_t1">限量</div>
              <div class="_t2">{{ item.number }}</div>
            </div>
          </div>
        </div>
        <div class="mask"></div>
      </div>
      <p class="no-found" v-if="renderWorksList.length <= 0">暂无作品</p>
    </div>
    <ShelvesNft
      @shelves="handelShelvesEmit"
      :params="shelvesObject"
      v-model:shelvesVisible="shelvesVisible"
      @cancel="handleCancelEmit"
    />
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watchEffect,
  getCurrentInstance,
  createVNode,
} from "vue";
import QRCode from "qrcode";
import { getWorksApi, shelvesNftApi, redeemCodeApi, getBannerApi } from "@api";
import { pollingItemsPublishApi } from "@/api/pllingApi";
import TabBar from "@/components/TabBar";
import ShelvesNft from "./ShelvesNft";
import { Modal } from "ant-design-vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
// publishStatusUnPublish = "0"; //下架
// publishStatusPublishing = "1" //审核
// publishStatusSuccess    = "2" //发布成功
// publishStatusFailed     = "3" //发布失败
const menus = [
  {
    text: "已上架",
    type: "2",
  },
  {
    text: "审核中",
    type: "1",
  },
  {
    text: "已下架",
    type: "0",
  },
];
export default defineComponent({
  components: {
    TabBar,
    ShelvesNft,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const currentMenu = ref("2");
    const menuList = reactive(menus);
    const worksList = ref([]);
    const renderWorksList = ref();
    const store = useStore();
    const smellProgramBaseUrl = ref({});
    const shelvesObject = reactive({
      id: "",
      publish: "",
    });
    const shelvesVisible = ref(false);
    const handleMouseover = (bol, id) => {
      bol
        ? (proxy.$refs[id].style.transform = "scale(1.2)")
        : (proxy.$refs[id].style.transform = "scale(1)");
    };
    const user = computed(() => store.getters.getUser);

    const showSwitchShelves = computed(() => (publish) => {
      if (publish === "0") return "上架";
      if (publish === "2") return "下架";
    });

    // 是否显示设置元素
    const showOptionsElement = computed(() => (publish) => publish !== "1");

    //是否免费
    const showFreePrice = computed(
      () => (free, price) => free === "true" ? "免费" : "$" + price
    );

    //是否显示价格
    const showPrice = computed(() => (publish) => publish !== "0");

    //是否显示二维码
    const showQrCode = computed(
      () => (free, publish) => free === "true" && publish !== "0"
    );

    const showOpenTime = computed(() => {
      return (item) =>
        item.publish === "2" &&
        Date.parse(new Date()) / 1000 < Number(item.opening_time);
    });

    // watchEffect listen table switch change event
    watchEffect(() => {
      renderWorksList.value = worksList.value
        .filter((item) => item.publish === currentMenu.value)
        .map((item) => ({
          ...item,
          file: proxy.joinPreviewUrl(item.file),
          author_avatar: proxy.joinPreviewUrl(item.author_avatar),
        }));
    }, [currentMenu, worksList]);

    onMounted(() => {
      getWorksList();
      getSmellProgramBaseUrl();
    });

    const getWorksList = async () => {
      const { err_code, result } = await getWorksApi(user.value.user_id);
      if (err_code === "0") {
        worksList.value = result;
      }
    };

    // 处理下架
    const handleUnShelvesNft = async (id, publish) => {
      const { err_code } = await shelvesNftApi(id);
      if (err_code === "0") {
        pollingItemsPublishApi(
          { userId: user.value.user_id, itemId: id, publish },
          (result) => {
            worksList.value = result;
          }
        );
      }
    };
    const getSmellProgramBaseUrl = async () => {
      const { result } = await getBannerApi();
      smellProgramBaseUrl.value = JSON.parse(result.share_base_url);
    };
    const handleShelvesClick = (id, publish) => {
      if (publish === "2") {
        handleUnShelvesNft(id, publish);
      }
      if (publish === "0") {
        shelvesVisible.value = true;
        shelvesObject.id = id;
        shelvesObject.publish = publish;
      }
    };
    const handleQrCodeClick = async (id) => {
      const { err_code, result } = await redeemCodeApi(id);
      if (err_code === "0") {
        let shellBaseUrl = "";
        if (
          smellProgramBaseUrl.value.nft_url.indexOf("open.weixin.qq.com") == -1
        ) {
          shellBaseUrl = `${smellProgramBaseUrl.value.nft_url}id${id}=${result.redeem_code}`;
        } else {
          shellBaseUrl = `${smellProgramBaseUrl.value.nft_url}id${id}=${result.redeem_code}#wechat-redirect`;
        }
        console.log(shellBaseUrl);
        const qrCode = await QRCode.toDataURL(shellBaseUrl);
        Modal.success({
          title: "二维码生成成功",
          content: createVNode("img", {
            src: qrCode,
            style: "width:100%;height:100%;margin-left:-19px;",
          }),
        });
        console.log(
          `https://mshare.dbchain.cloud/applet?id${id}=${result.redeem_code}`
        );
      }
    };

    const handelShelvesEmit = ({ id, publish }) => {
      shelvesVisible.value = false;
      pollingItemsPublishApi(
        { userId: user.value.user_id, itemId: id, publish },
        (result) => {
          worksList.value = result;
        }
      );
    };

    const handleCancelEmit = () => {
      shelvesVisible.value = false;
    };

    return {
      handleMouseover,
      currentMenu,
      menuList,
      renderWorksList,
      handleShelvesClick,
      handleQrCodeClick,
      showSwitchShelves,
      showOptionsElement,
      showFreePrice,
      showPrice,
      showQrCode,
      shelvesObject,
      showOpenTime,
      handelShelvesEmit,
      handleCancelEmit,
      shelvesVisible,
      dayjs,
    };
  },
});
</script>

<style scoped lang="scss">
.ip-detail {
  // overflow: hidden;
  .ip-detail-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-l {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 10px;
        height: 10px;
        border-radius: 1px;
        border: 2px solid #222222;
        border-right-color: transparent;
        border-top-color: transparent;
        transform: rotate(40deg);
        cursor: pointer;
      }
      .char {
        font-size: 20px;
        font-weight: 500;
        color: #000000;
        margin: 0 17px;
      }
      .status {
        font-size: 14px;
        font-weight: 400;
        display: inline-block;
        position: relative;
        &::before {
          position: relative;
          top: 50%;
          left: -6px;
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #2caf71;
          border-radius: 50%;
        }
      }
    }
  }
  .ip-lists {
    margin-top: 20px;
    overflow-y: auto;
    height: 90%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    // justify-content: space-around;
    align-content: flex-start;
    .no-found {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 0;
    }
    .card {
      width: 242px;
      height: 242px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      box-shadow: 0px 2px 6px 0px rgba(53, 53, 53, 0.09);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      margin-right: 6px;
      margin-bottom: 6px;

      .img {
        width: 100%;
        height: 100%;
        transition: all 0.3s;
        z-index: 1;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
        }
      }
      .options {
        position: absolute;
        top: 11px;
        right: 2px;
        z-index: 2;
        width: 92px;
        height: 34px;
        background: rgba(0, 0, 0, 0.68);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 9px 10px;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          color: #ffd36c !important;
        }
        .icon {
          color: #fff;
        }
      }
      .me {
        display: flex;
        position: absolute;
        width: calc(100% - 25px);
        justify-content: space-between;
        align-items: center;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        .me-t {
          h3 {
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            margin: 0;
            padding: 0;
          }
          .avator-des {
            display: flex;
            align-items: center;
            margin-top: 6px;
            .imgs {
              position: relative;
              width: 20px;
              height: 20px;
              img:first-child {
                width: 100%;
                width: 100%;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 0;
              }
              .icon {
                width: 10px;
                height: 10px;
                position: absolute;
                top: 50%;
                right: -10px;
                transform: translateX(-50%);
              }
            }
            span {
              font-size: 12px;
              color: #fff;
              display: inline-block;
              margin-left: 10px;
            }
          }
        }
        .me-m {
          margin-left: 20px;

          .manay {
            font-size: 19px;
            color: #fff;
            font-weight: 500;
            text-align: right;
          }
          ._limit {
            height: 20px;
            border-radius: 6px;
            border: 1px solid #ffbd21;
            display: flex;
            text-align: right;
            ._t1 {
              display: block;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 20px;
              background: #ffbd21;
              padding: 0 4px;
            }
            ._t2 {
              display: block;
              height: 20px;
              font-size: 12px;
              font-family: Roboto-Medium, Roboto;
              font-weight: 500;
              color: #ffbd21;
              line-height: 20px;
              padding: 0 4px;
              min-width: 18px;
              text-align: center;
            }
          }
          // .text {
          //   span:first-child {
          //     background: #ffbd21;
          //     border-radius: 4px;
          //     font-size: 8px;
          //     color: #000;
          //     border-radius: 4px;
          //     display: inline-block;
          //     padding: 2px;
          //   }
          //   span:last-child {
          //     display: inline-block;
          //     box-sizing: border-box;
          //     border: #ffbd21 1px solid;
          //     border-left-color: transparent;
          //     border-radius: 4px;
          //     color: #fff;
          //     padding: 2px;

          //     font-size: 8px;
          //   }
          // }
        }
      }
      .sale {
        position: absolute;
        top: 11px;
        left: 2px;
        background: rgba(0, 0, 0, 0.6);
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        // width: 80px;
        padding: 0 5px;
        height: 34px;
        border-radius: 5px;
        line-height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          color: #ffd36c;
          margin-right: 10px;
          font-size: 12px;
        }
        span {
          font-size: 12px;
          color: #ffd36c;
        }
      }
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;

        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        box-shadow: 0px 2px 6px 0px rgba(53, 53, 53, 0.09);
      }
    }
  }
}
</style>
