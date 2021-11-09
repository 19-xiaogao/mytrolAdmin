<template>
  <div class="upload_collection">
    <div class="titles">
      <h3>藏品描述图片</h3>
      <div class="prew" @click="hanldePrewClick">
        <icon-svg icon="icon-icon4-hover" class="icon"></icon-svg>
        <span>预览</span>
      </div>
    </div>
    <div class="upload-cot">
      <img src="@assets/images/sheleves-add.png" alt="" />
      <p>
        在此添加藏品描述图片
        <br />
        (大小不超过500KB)
      </p>
      <input type="file" alt="" @change="handleUploadFile" />
      <img :src="imgSrc" class="upload" v-if="imgSrc" alt="" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { previewFile } from "@/utils";

export default defineComponent({
  name: "uploadCollection",
  props: {
    nft_background: Object,
    previewImgClick: Function,
  },
  setup(props, { emit }) {
    const imgSrc = ref("");
    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return (e.target.value = "");
      previewFile(imgFile[0]).then((res) => {
        imgSrc.value = res;
        emit("update:nft_background", imgFile[0]);
      });
    };
    const hanldePrewClick = () => {
      emit("previewImgClick", imgSrc);
    };

    return {
      imgSrc,
      handleUploadFile,
      hanldePrewClick,
    };
  },
});
</script>

<style scoped lang="scss">
.upload_collection {
  flex: 1;
  flex-direction: column;

  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #f3f1f1;
  margin-left: 10px;
  padding: 10px;
  .titles {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 19px;
      font-weight: 600;
      color: #000000;
      padding: 0;
      margin: 0;
    }
    .prew {
      width: 74px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000000;
      border-radius: 8px;
      cursor: pointer;
      .icon {
        color: #fff;
        font-size: 1.4rem;
      }
      span {
        color: #fff;
      }
    }
  }

  .upload-cot {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 37px - 34px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    p {
      width: 277px;
      text-align: center;
      margin-top: 21px;
    }
    input {
      display: inline-block;
      width: 100%;
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 1;
    }
    .upload {
      position: absolute;
      width: 100%;
      height: 120%;
      object-fit: cover;
      object-position: top center;
    }
  }
}
</style>
