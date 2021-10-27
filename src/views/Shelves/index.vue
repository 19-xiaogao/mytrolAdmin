<template>
  <div class="shelves">
    <div class="top">
      <UploadNft />
      <div class="user_search">
        <div class="search-title">
          <input placeholder="给你作品起一个独特的标题" />
        </div>
        <div class="search-base">
          <div class="avator">
            <div class="header">
              <img src="../../assets/images/avtor.png" alt="" />
              <p>Jason</p>
            </div>
            <div class="icon"></div>
          </div>
          <div class="price">
            <div>价格</div>
            <input type="text" placeholder="请输入价格" />
          </div>
          <div class="price">
            <div>限量</div>
            <input type="text" placeholder="请输入数量" />
          </div>
          <div class="price">
            <div>请求时间</div>
            <input type="text" placeholder="2021.03.23" />
          </div>
          <div class="select-headers">
            <div class="header" v-for="item in [1, 2, 3, 4, 5]" :key="item">
              <img src="../../assets/images/avtor.png" alt="" />
              <span>Jason</span>
            </div>
          </div>
        </div>
        <textarea
          class="nft-des"
          placeholder="给你的作品来一段介绍吧"
        ></textarea>
      </div>
    </div>
    <div class="btns">
      <div class="btn">
        <img src="../../assets/images/sheleves-through.png" alt="" />
        <span>上架</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import UploadNft from "./UploadNft";
export default defineComponent({
  components: {
    UploadNft,
  },
});
</script>

<style lang="scss" scoped>
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
          input {
            font-size: 24px;
            width: 90%;
            font-weight: 500;
            color: #000000;
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
          .header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #f7f7f7;
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
            span {
              color: #000000;
              font-size: 14px;
            }
          }
        }
      }
      .nft-des {
        margin-top: 16px;
        width: 100%;
        display: inline-block;
        border-radius: 8px;
        border: 1px solid #f3f1f1;
        height: calc(470px - 16px - 118px - 5px - 34px);
        padding: 20px;
        font-size: 16px;
        color: #000000;
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
      width: 154px;
      height: 48px;
      background: #54a44b;
      border-radius: 8px;
      display: flex;
      justify-content: center;
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
