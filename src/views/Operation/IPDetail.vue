<template>
  <div class="ip-detail" v-if="visible">
    <div class="ip-detail-title">
      <div class="title-l">
        <span class="icon" @click="handleReturnClick"></span>
        <div class="char">{{ params.name }}</div>
        <div
          :class="isShowStatus(params.status) ? 'off-span status' : 'status'"
        >
          {{ isShowStatus(params.status) ? "未运营" : "运营中" }}
        </div>
      </div>
      <div class="title-r"></div>
    </div>
    <div class="ip-lists">
      <div
        class="card"
        @mouseover="() => handleMouseover(true, item.id)"
        @mouseout="() => handleMouseover(false, item.id)"
        v-for="item in workList"
        :key="item.id"
      >
        <div class="img" :ref="item.id">
          <img :src="item.file" alt="" />
        </div>

        <div class="me">
          <div class="me-t">
            <h3>{{ item.name }}</h3>
            <div class="avator-des">
              <div class="imgs">
                <img :src="item.avatar" alt="" />
                <img src="@assets/images/v-icon.png" class="icon" alt="" />
              </div>
              <span>{{ item.nickname }}</span>
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
    </div>
    <p class="no-found" v-if="workList.length <= 0">暂无数据</p>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  watchEffect,
  computed,
  getCurrentInstance,
} from "vue";
import { getLastestNftApi } from "@api";
export default defineComponent({
  props: {
    visible: Boolean,
    params: Object,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const pagination = reactive({
      page: 1,
      numbers: 10,
    });
    const workList = ref([]);
    const handleMouseover = (bol, id) => {
      bol
        ? (proxy.$refs[id].style.transform = "scale(1.2)")
        : (proxy.$refs[id].style.transform = "scale(1)");
    };

    const handleReturnClick = () => {
      emit("update:visible", false);
    };

    const getLastetNftList = async (id, page, numbers) => {
      const { err_code, result } = await getLastestNftApi(
        id,
        page,
        String(numbers)
      );
      if (err_code === "0") {
        console.log("作品列表", result);
        workList.value = result.map((item) => ({
          ...item,
          avatar: proxy.joinPreviewUrl(item.avatar),
          file: proxy.joinPreviewUrl(item.file),
        }));
      }
    };
    watchEffect(() => {
      getLastetNftList(props.params.id, pagination.page, pagination.numbers);
    }, [props.params.id]);

    const isShowStatus = computed(() => {
      return (status) => status === "off";
    });
    return {
      handleMouseover,
      handleReturnClick,
      isShowStatus,
      workList,
    };
  },
});
</script>

<style scoped lang="scss">
.ip-detail {
  position: relative;
  height: 98%;
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
      .off-span {
        &::before {
          background: red !important;
        }
      }
    }
    .title-r {
      display: flex;
      .icons {
        font-size: 1.4rem;
        width: 70px;
        .icon {
          cursor: pointer;
          margin-left: 10px;
        }
      }

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
        margin-left: 91px;
        .icon {
          font-size: 1rem;
        }
        span {
          font-size: 14px;
          color: #000;
          font-weight: 400;
        }
      }
    }
  }
  .ip-lists {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
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
        span {
          font-size: 14px;
          font-weight: 400;
          color: #ffd36c;
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
  .no-found {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    margin: 0;
    padding: 0;
  }
}
</style>
