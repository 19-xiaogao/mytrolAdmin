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
        <a-dropdown class="options">
          <p>
            <span class="text">设置</span>
            <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg>
          </p>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleShelvesClick(item.id)">
                <span>下架</span>
              </a-menu-item>
              <a-menu-item>
                <span>二维码</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

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
            <div class="manay">${{ item.price }}</div>

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
} from "vue";
import { getWorksApi, shelvesNftApi } from "@api";
import TabBar from "@/components/TabBar";
import { useStore } from "vuex";

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
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const currentMenu = ref("2");
    const menuList = reactive(menus);
    const worksList = ref([]);
    const renderWorksList = ref();
    const store = useStore();

    const handleMouseover = (bol, id) => {
      bol
        ? (proxy.$refs[id].style.transform = "scale(1.2)")
        : (proxy.$refs[id].style.transform = "scale(1)");
    };
    const user = computed(() => store.getters.getUser);

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
    });

    const getWorksList = async () => {
      const { err_code, result } = await getWorksApi(user.value.user_id);
      if (err_code === "0") {
        worksList.value = result;
      }
    };

    const handleShelvesClick = async (id) => {
      console.log(id);
      const { err_code,result } = await shelvesNftApi(id);
      if(err_code === '0'){
        console.log(result);
      }
    };

    return {
      handleMouseover,
      currentMenu,
      menuList,
      renderWorksList,
      handleShelvesClick,
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
        right: 14px;
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
