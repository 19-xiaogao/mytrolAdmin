<template>
  <a-modal :visible="createVisible" class="modal" title="添加运营IP">
    <div class="upload-img">
      <div class="upload-box">
        <div class="upload-btn">
          <span>上传图片</span>
          <input alt="" type="file" @change="handleUploadFile"/>
        </div>
        <img v-if="imgSrc.value" :src="imgSrc.value" alt=""/>
      </div>
      <p>温馨提示：尺寸为510*324，请按照特定模板的原则产图</p>
    </div>
    <div class="upload-img">
      <div class="upload-box">
        <div class="upload-btn">
          <span>上传背景图片</span>
          <input alt="" type="file" @change="handleBgUploadFile"/>
        </div>
        <img v-if="bgImgSrc.value" :src="bgImgSrc.value" alt=""/>
      </div>
      <p>温馨提示：尺寸为510*1200，请按照特定模板的原则产图</p>
    </div>
    <div class="user-input">
      <div class="user">
        <span>IP系列名称</span>
        <input
            v-model="name"
            placeholder="请输入IP系列名称"
            required
            type="text "
        />
      </div>
    </div>
    <template #closeIcon>
      <div class="close" @click="handleClose">取消</div>
    </template>
    <template #footer>
      <a-button :loading="loading" class="create-user" @click="handleSureClick"
      >确定
      </a-button
      >
    </template>
  </a-modal>
</template>

<script>
import {defineComponent, reactive, ref, toRefs} from "vue";
import {addUpdateIpApi, uploadAliOssApi} from "@api";
import {backFileType, previewFile, uuidToCreateHash, warningNotify,} from "@/utils";

export default defineComponent({
  props: {
    createVisible: {
      type: Boolean,
    },
  },
  setup(props, {emit}) {
    const loading = ref(false);
    const addIpParams = reactive({
      imgSrc: {
        type: "",
        value: "",
      },
      name: "",
      bgImgSrc: {
        type: "",
        value: "",
      },
    });
    const formData = new FormData();
    formData.append("status", "off");
    formData.append("operate", "add");
    formData.append("name", "");
    formData.append("number", "");
    formData.append("file", "");
    formData.append("bg_file", "");

    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return;
      previewFile(imgFile[0]).then((res) => {
        addIpParams.imgSrc.value = res;
        addIpParams.imgSrc.type = backFileType(imgFile[0]);
        formData.set("file", imgFile[0]);
        e.target.value = "";
      });
    };

    const handleBgUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return;
      previewFile(imgFile[0]).then((res) => {
        addIpParams.bgImgSrc.value = res;
        addIpParams.bgImgSrc.type = backFileType(imgFile[0]);
        formData.set("bg_file", imgFile[0]);
        e.target.value = "";
      });
    };

    const uploadAllToOss = () => {
      return new Promise((resolve, reject) => {
        const fileName = `ip/${uuidToCreateHash()}.${addIpParams.imgSrc.type}`;
        const fileBgName = `ip/${uuidToCreateHash()}.${
            addIpParams.bgImgSrc.type
        }`;
        Promise.all([
          uploadAliOssApi(fileName, formData.get("file")),
          uploadAliOssApi(fileBgName, formData.get("bg_file")),
        ])
            .then((result) => {
              resolve({
                file: result[0].res.requestUrls[0],
                bg_file: result[1].res.requestUrls[0],
              });
            })
            .catch((err) => reject(err));
      });
    };
    const handleClose = () => {
      emit("update:createVisible", false);
    };
    const handleSureClick = async () => {
      formData.set("name", addIpParams.name);

      if (!addIpParams.imgSrc.value) {
        return warningNotify("请上传图片");
      }

      if (!addIpParams.bgImgSrc.value) {
        return warningNotify("请背景图片");
      }
      loading.value = true;
      const ossResult = await uploadAllToOss();

      formData.set("file", ossResult.file);
      formData.set("bg_file", ossResult.bg_file);

      const {err_code} = await addUpdateIpApi(formData);
      if (err_code === "0") {
        emit("update:createVisible", false);
        emit("ok");
        addIpParams.imgSrc = {type: "", value: ""};
        addIpParams.bgImgSrc = {type: "", value: ""};
        addIpParams.name = "";
      }
      loading.value = false;
    };
    return {
      handleClose,
      handleUploadFile,
      ...toRefs(addIpParams),
      handleSureClick,
      handleBgUploadFile,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
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
