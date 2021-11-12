<template>
  <a-modal :visible="createVisible" class="modal" title="添加运营IP">
    <div class="upload-img">
      <div class="upload-box">
        <div class="upload-btn">
          <span>上传图片</span>
          <input type="file" alt="" @change="handleUploadFile" />
        </div>
        <img :src="imgSrc" alt="" v-if="imgSrc" />
      </div>
      <p>温馨提示：尺寸为510*324，请按照特定模板的原则产图</p>
    </div>
    <div class="user-input">
      <div class="user">
        <span>IP系列名称</span>
        <input
          type="text "
          placeholder="请输入IP系列名称"
          required
          v-model="name"
        />
      </div>
    </div>
    <template #closeIcon>
      <div class="close" @click="handleClose">取消</div>
    </template>
    <template #footer>
      <div class="create-user" @click="handleSureClick">确定</div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { addUpdateIpApi } from "@api";
import { previewFile, successNotify } from "@/utils";
export default defineComponent({
  props: {
    createVisible: {
      type: Boolean,
    },
    uploadImg: Object,
  },
  setup(props, { emit }) {
    const addIpParams = reactive({ imgSrc: "", name: "" });
    const formData = new FormData();
    formData.append("status", "off");
    formData.append("operate", "add");
    formData.append("name", "");
    formData.append("number", "");
    formData.append("file", "");

    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return;
      previewFile(imgFile[0]).then((res) => {
        addIpParams.imgSrc = res;
        formData.set("file", imgFile[0]);
        emit("update:uploadImg", imgFile[0]);
        e.target.value = "";
      });
    };
    const handleClose = () => {
      emit("update:createVisible", false);
    };
    const handleSureClick = async () => {
      formData.set("name", addIpParams.name);
      const { err_code } = await addUpdateIpApi(formData);
      if (err_code === "0") {
        emit("update:createVisible", false);
        emit("ok");
        successNotify("创建IP成功");
      }
    };
    return {
      handleClose,
      handleUploadFile,
      ...toRefs(addIpParams),
      handleSureClick,
    };
  },
});
</script>

<style scoped lang="scss">
.modal-create-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 52px;
  background: #f1f1f1;
  border-radius: 8px;
  padding: 7px;
  transform: translateX(40%);
  div {
    width: 112px;
    height: 38px;
    border-radius: 6px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
  }
  .bgf {
    background: #fff;
  }
}
.user-input {
  margin-top: 20px;
  .user {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
    span {
      font-size: 14px;
      color: #000000;
    }
    input {
      height: 52px;
      background: #f7f7f7;
      width: 100%;
      border-radius: 8px;
      margin-top: 4px;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 14px;
    }
  }
}
.create-user {
  width: 100%;
  height: 52px;
  background: #2f0088;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 52px;
  cursor: pointer;
  margin-bottom: 10px;
}
.close {
  font-weight: 400;
  color: #bcbcbc;
  cursor: pointer;
}
.upload-img {
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #2b2b2b;
  }
  .upload-box {
    position: relative;
    width: 224px;
    height: 142px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
    .upload-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      color: #fff;
      background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
      border-radius: 6px;

      input {
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: pointer;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 1;
      }
    }
  }
}
</style>
