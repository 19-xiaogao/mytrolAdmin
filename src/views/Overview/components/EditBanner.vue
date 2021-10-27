<template>
  <div class="edit-banner">
    <h3>首页Banner</h3>
    <div class="swiper-box">
      <a-carousel class="swiper-pew" autoplay>
        <div><h3>1</h3></div>
        <div><h3>2</h3></div>
        <div><h3>3</h3></div>
        <div><h3>4</h3></div>
      </a-carousel>
      <div class="swiper-link">
        <div class="link-detail">
          <h5>banner1链接</h5>
          <div class="link-detail-input">
            <input type="text" />
            <button>上传图片</button>
          </div>
        </div>
        <div class="link-detail">
          <h5>banner1链接</h5>
          <div class="link-detail-input">
            <input
              class="txt-overflow"
              type="text"
              value="https://dribbble.com/shots/16624485-Raaaaaaaaaaa"
            />
            <button>上传图片</button>
          </div>
        </div>
        <div class="link-detail">
          <h5>banner1链接</h5>
          <div class="link-detail-input">
            <input type="text" />
            <button>上传图片</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  // height: 100%;
  width: 22vw;
  // line-height: 100%;
  height: 225px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
.edit-banner {
  width: 58%;
  height: 33.11%;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
  border-radius: 8px;
  border: 0px solid rgba(213, 213, 213, 0.58);
  box-sizing: border-box;
  padding: 23px 30px;
  h3 {
    text-align: left;
  }
  .swiper-box {
    display: flex;
    justify-content: space-between;
    .swiper-pew {
      width: 22vw;
      margin-right: 10px;
    }
    .swiper-link {
      flex: 1;

      .link-detail {
        text-align: left;
        margin-top: 12px;
        h5 {
          font-size: 14px;
          font-weight: 400;
          color: #0d0048;
        }
        .link-detail-input {
          margin-top: 5px;
          display: flex;
          input {
            background: #f7f7f7;
            border-radius: 6px;
            flex: 1;
            height: 34px;
            font-size: 14px;
            padding-left: 14px;
            font-weight: 400;
            color: #434343;
          }
          button {
            width: 80px;
            height: 34px;
            background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
            border-radius: 6px;
            margin-left: 14px;
            color: #ffffff;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
