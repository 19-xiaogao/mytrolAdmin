<template>
  <div class="add-equity-box">
    <h3>{{ uploadName }}</h3>
    <div class="equity-cover">
      <icon-svg icon="icon-tianjia" class="icon"></icon-svg>
      <p>卡片尺寸1002*602，图片内容需要按照模版尺寸和元素</p>
      <input
        type="file"
        class="upload-file"
        @change="handleEquityCoverChange"
      />
      <img v-if="file.value" :src="file.value" alt="" />
    </div>
  </div>
</template>

<script>
import { previewFile, backFileType } from "@/utils";
import { reactive } from "vue";
export default {
  props: {
    uploadName: String,
  },
  setup(props, { emit }) {
      
    const file = reactive({
      type: "",
      value: "",
    });

    const handleEquityCoverChange = (e) => {
      const targetFile = e.target.files;
      previewFile(targetFile[0]).then((res) => {
        file.type = backFileType(targetFile[0]);
        file.value = res;
        emit("uploadDone", targetFile[0], file.type);
      });
    };

    return {
      handleEquityCoverChange,
      file,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-equity-box {
  margin-top: 10px;
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }
  .equity-cover {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 16px;
    background: #f1f1f1;
    .icon {
      position: absolute;
      font-size: 40px;
      font-weight: 600;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    p {
      position: absolute;
      font-size: 40px;
      top: 65%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 223px;
      height: 52px;
      font-size: 14px;
      text-align: center;
      font-weight: 400;
      color: #979797;
    }
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      object-fit: cover;
      object-position: center center;
    }
    .upload-file {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      top: 0;
      left: 0;
      cursor: pointer;
      overflow: hidden;
      z-index: 11;
    }
  }
}
</style>
