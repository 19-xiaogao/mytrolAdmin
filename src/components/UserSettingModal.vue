<template>
  <a-modal
    class="modal"
    v-model:visible="visible"
    title="设计师信息"
    :maskClosable="false"
    :closable="false"
  >
    <div class="avator">
      <div class="upload-avator" ref="upload_avator">
        <icon-svg icon="icon-a-bianzu12" v-if="!imgSrc" class="icon"></icon-svg>
        <input type="file" alt="" @change="handleUploadFile" />
        <img :src="imgSrc" class="upload" v-if="imgSrc" alt="" />
      </div>
      <div class="upload-warn">
        <img src="@assets/images/header-per.png" alt="" />
        <p>
          温馨提示：头像需要选择正方形的头像，尽量选择纯色背景，容易识别的个人头像
        </p>
      </div>
    </div>
    <div class="user-input">
      <span>创作者名称</span>
      <input type="text" placeholder="请输入创作者名称" v-model="username" />
    </div>
    <template #footer>
      <div class="footer" @click="handleSureClick">确定</div>
    </template>
  </a-modal>
</template>

<script>
import {
  defineComponent,
  ref,
  getCurrentInstance,
  reactive,
  toRefs,
} from "vue";
import { previewFile } from "@/utils";
import { editPersonApi, getUserInfoApi } from "@api";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    user_file: Object,
  },
  name: "userSettingModal",
  setup(props, { emit }) {
    const visible = ref(true);
    const userMessage = reactive({ imgSrc: "", username: "" });
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const fromData = new FormData();

    fromData.append("nickname", "");
    fromData.append("file", "");
    fromData.append("description", "");

    const handleUploadFile = (e) => {
      let imgFile = e.target.files;
      if (!imgFile.length) return;

      fromData.set("file", imgFile[0]);

      previewFile(imgFile[0]).then((res) => {
        userMessage.imgSrc = res;
        proxy.$refs.upload_avator.style.opacity = "1.0";
        emit("update:user_file", imgFile[0]);
        e.target.value = "";
      });
    };

    const handleSureClick = async () => {
      if (!userMessage.imgSrc)
        return window.$message.warn({
          message: "提示",
          description: "请上传头像",
        });
      if (!userMessage.username)
        return window.$message.warn({
          message: "提示",
          description: "请输入名称",
        });

      fromData.set("nickname", userMessage.username);
      const { err_code } = await editPersonApi(fromData);
      if (err_code === "0") {
        visible.value = false;
        getUserInfoApi().then(({ err_code, result }) => {
          if (err_code === "0") {
            // 本地存一份，vuex 存一份
            const setPersonMessage = {
              ...result,
              avatar: proxy.joinPreviewUrl(result.avatar),
            };
            store.commit("setPersonMessage", setPersonMessage);
            localStorage.setItem(
              "personMessage",
              JSON.stringify(setPersonMessage)
            );
          }
        });
      }
    };
    return {
      visible,
      handleUploadFile,
      ...toRefs(userMessage),
      handleSureClick,
    };
  },
});
</script>

<style scoped lang="scss">
.modal {
  padding: 20px;
  box-sizing: border-box;
  .footer {
    width: 490px;
    height: 52px;
    background: #2f0088;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 24px;
    text-align: center;
    line-height: 54px;
    cursor: pointer;
  }
  .avator {
    display: flex;
    .upload-avator {
      width: 116px;
      height: 116px;
      background: #000000;
      border-radius: 14px;
      opacity: 0.39;
      position: relative;
      margin-right: 44px;
      border-radius: 4px;
      overflow: hidden;
      .icon {
        position: absolute;
        color: #fff;
        font-size: 5rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
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
    .upload-warn {
      flex: 1;

      img {
        width: 162px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        color: #2b2b2b;
        margin: 0;
        padding: 0;
        font-size: 14px;
      }
    }
  }
  .upload {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    object-position: top center;
  }
  .user-input {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 39px;
    span {
      font-size: 14px;
      color: #000;
      margin-bottom: 9px;
    }
    input {
      width: 100%;
      height: 52px;
      border-radius: 8px;
      background-color: #f7f7f7;
      padding-left: 10px;
    }
  }
}
</style>
