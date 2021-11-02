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
        @mouseover="() => handleMouseover(true)"
        @mouseout="() => handleMouseover(false)"
      >
        <div class="img" ref="imgRef">
          <img src="@assets/images/order-detail-img.jpg" alt="" />
        </div>
        <div class="options">
          <img src="@assets/images/start.png" alt="" />
          <span>入选</span>
          <icon-svg icon="icon-a-bianzu13"></icon-svg>
        </div>
        <div class="me">
          <div class="me-t">
            <h3>少女懵懂的年少时光</h3>
            <div class="avator-des">
              <div class="imgs">
                <img src="@assets/images/avtor.png" alt="" />
                <img src="@assets/images/v-icon.png" class="icon" alt="" />
              </div>
              <span>龙雷雷</span>
            </div>
          </div>
          <div class="me-m">
            <div class="manay">$199.9</div>
            <div class="text">
              <span>限量</span>
              <span>1000</span>
            </div>
          </div>
        </div>
        <div class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import TabBar from "@/components/TabBar";
const menus = [
  {
    text: "已上架",
    type: 1,
  },
  {
    text: "审核中",
    type: 2,
  },
  {
    text: "已下架",
    type: 3,
  },
];
export default defineComponent({
  components: {
    TabBar,
  },
  setup() {
    const imgRef = ref();
    const currentMenu = ref(1);
    const menuList = reactive(menus);
    const handleMouseover = (bol) => {
      bol
        ? (imgRef.value.style.transform = "scale(1.2)")
        : (imgRef.value.style.transform = "scale(1)");
    };
    return { handleMouseover, imgRef, currentMenu, menuList };
  },
});
</script>

<style scoped lang="scss">
.ip-detail {
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
        justify-content: space-between;
        align-items: center;
        bottom: 5px;
        left: 18px;
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
          .text {
            span:first-child {
              background: #ffbd21;
              border-radius: 4px;
              font-size: 8px;
              color: #000;
              border-radius: 4px;
              display: inline-block;
              padding: 2px;
            }
            span:last-child {
              display: inline-block;
              box-sizing: border-box;
              border: #ffbd21 1px solid;
              border-left-color: transparent;
              border-radius: 4px;
              color: #fff;
              padding: 2px;

              font-size: 8px;
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
}
</style>
