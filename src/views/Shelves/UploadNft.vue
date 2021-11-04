<template>
  <div class="upload-nft">
    <img src="@assets/images/mytrolLogo.png" class="logo" alt="" />
    <div class="add-logo">
      <img src="@assets/images/sheleves-add.png" alt="" />
      <p>上传创作数字藏品</p>
    </div>
    <input type="file" class="input-file" @change="handleUploadFile" />
    <a-image
      class="upload-img"
      width="100%"
      height="100%"
      :visible="visibleImg"
      v-if="imgSrc"
      :src="imgSrc"
    />
    <img
      v-if="imgSrc"
      src="@assets/images/expand.png"
      class="icon"
      @click="handleImgVisibleClick"
      alt=""
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { previewFile } from "@/utils";

// 这里实现上传的逻辑
export default defineComponent({
  props: {
    doneImgFile: Object,
  },
  setup(props, { emit }) {
    const imgSrc = ref("");
    const visibleImg = ref(false);
    const handleImgVisibleClick = () => {
      visibleImg.value = true;
    };

    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return (e.target.value = "");
      previewFile(imgFile[0]).then((res) => {
        imgSrc.value = res;
        emit("update:doneImgFile", imgFile[0]);
      });
    };
    return {
      imgSrc,
      handleUploadFile,
      handleImgVisibleClick,
      visibleImg,
    };
  },
});
</script>

<style scoped lang="scss">
.upload-nft {
  width: 358px;
  height: 470px;
  background: #f7f7f7;
  border-radius: 8px;
  position: relative;
  .logo {
    position: absolute;
    top: 26px;
    left: 26px;
  }
  .add-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p {
      margin-top: 20px;
      font-size: 20px;
      color: #7d7d7d;
    }
  }
  .input-file {
    width: 100%;
    position: absolute;
    height: calc(100% - 30px);
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }
  .upload-img {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    object-position: 50% 50%;
    z-index: 2;
    cursor: pointer;
  }
  .icon {
    z-index: 1;
    position: absolute;
    bottom: 0;
    right: 0px;
    color: #000;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
</style>
