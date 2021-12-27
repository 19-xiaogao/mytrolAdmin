<template>
  <a-modal
    class="modal"
    v-model:visible="visible"
    title="个人信息设置"
    :maskClosable="false"
    :closable="false"
  >
    <div class="avator">
      <div class="upload-avator" ref="upload_avator">
        <icon-svg icon="icon-a-bianzu12" v-if="!imgSrc" class="icon"></icon-svg>
        <input
          type="file"
          alt=""
          @change="handleUploadFile"
          accept=".png,.jpg"
        />
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
      <span>名称</span>
      <input
        type="text"
        placeholder="请输入创作者名称(10个字符以内)"
        v-model="username"
      />
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
import { useStore } from "vuex";
import { previewFile, warningNotify } from "@/utils";
import { editPersonApi } from "@api";
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
      if (imgFile[0].size > 1024 * 50) {
        return warningNotify("请上传50KB以内的头像");
      }
      fromData.set("file", imgFile[0]);

      previewFile(imgFile[0]).then((res) => {
        userMessage.imgSrc = res;
        proxy.$refs.upload_avator.style.opacity = "1.0";
        emit("update:user_file", imgFile[0]);
        e.target.value = "";
      });
    };

    const handleSureClick = async () => {
      if (!userMessage.imgSrc) return warningNotify("请上传头像");
      if (!userMessage.username) return warningNotify("请输入名称");
      if (userMessage.username.trim().length >= 20) {
        return warningNotify("名字太长，20个字以内");
      }

      fromData.set("nickname", userMessage.username);

      // oss 图片上传

      const { err_code, result } = await editPersonApi(fromData);
      if (err_code === "0") {
        // 本地存一份，vuex 存一份
        const setPersonMessage = {
          ...result,
          address: "",
          my_code: "",
          token: "",
          avatar: proxy.joinPreviewUrl(result.cid),
        };
        store.commit("setPersonMessage", setPersonMessage);
        localStorage.setItem("personMessage", JSON.stringify(setPersonMessage));
        visible.value = false;
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
