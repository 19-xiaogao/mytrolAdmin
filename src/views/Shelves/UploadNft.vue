<template>
  <div class="upload-nft">
    <img src="@assets/images/mytrolLogo.png" class="logo" alt="" />
    <div class="add-logo">
      <img src="@assets/images/sheleves-add.png" alt="" />
      <p>{{ title }}</p>
      <span>{{ decs }}</span>
    </div>
    <img class="upload-img" v-if="imgSrc" :src="imgSrc" />
    <img
      v-if="imgSrc"
      src="@assets/images/expand.png"
      class="icon"
      @click="handleImgVisibleClick"
      alt=""
    />
    <input
      type="file"
      class="input-file"
      style="z-index: 3"
      :accept="uploadAccept"
      @change="handleUploadFile"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { previewFile, warningNotify } from "@/utils";

// 这里实现上传的逻辑
export default defineComponent({
  props: {
    doneImgFile: Object,
    previewImgClick: Function,
    type: String,
  },
  setup(props, { emit }) {
    const imgSrc = ref("");
    const handleImgVisibleClick = () => {
      emit("previewImgClick", imgSrc);
    };

    const typeBol = computed(() => props.type === "originalImage");

    const uploadAccept = computed(() =>
      typeBol.value ? ".png,.jpg,.gif,.gift" : ".png,.jpg"
    );

    const title = computed(() => {
      if (typeBol.value) {
        return "上传藏品图";
      } else {
        return "上传缩略图";
      }
    });

    const decs = computed(() => {
      if (typeBol.value) {
        return "建议大小在10M以内";
      } else {
        return "建议大小在300KB以内";
      }
    });

    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return;
      if (typeBol.value && imgFile[0].size > 1024 * 1024 * 10) {
        return warningNotify("请上传10M以内的图片");
      }
      if (!typeBol.value && imgFile[0].size > 1024 * 500) {
        return warningNotify("请上传300K以内的图片");
      }

      previewFile(imgFile[0]).then((res) => {
        imgSrc.value = res;
        emit("update:doneImgFile", imgFile[0]);
        e.target.value = "";
      });
    };

    return {
      imgSrc,
      handleUploadFile,
      handleImgVisibleClick,
      title,
      decs,
      uploadAccept
    };
  },
});
</script>

<style scoped lang="scss">
.upload-nft {
  width: 358px;
  height: 40vh;
  background: #f7f7f7;
  border-radius: 8px;
  position: relative;
  z-index: 1;
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
      padding: 0;
      margin: 20px 0 5px;
      font-size: 20px;
      color: #7d7d7d;
    }
    span {
      color: #7d7d7d;
    }
  }
  .input-file {
    width: 100%;
    position: absolute;
    height: calc(100% - 30px);
    opacity: 0;
    cursor: pointer;
    z-index: 11;
  }
  .upload-img {
    position: absolute;
    width: 100%;
    display: inline-block;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    object-position: 50% 50%;
    cursor: pointer;
    z-index: 1;
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
