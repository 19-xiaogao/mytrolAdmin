<template>
  <a-modal
    class="modal"
    v-model:visible="visible"
    title="设计师信息"
    :closable="false"
  >
    <!-- :maskClosable="false" -->

    <div class="avator">
      <div class="upload-avator">
        <icon-svg icon="icon-a-bianzu12" class="icon"></icon-svg>
        <input type="file" alt="" />
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
      <input type="text" placeholder="请输入创作者名称" />
    </div>
    <template #footer>
      <div class="footer">确定</div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "userSettingModal",
  setup() {
    const visible = ref(true);
    const showModal = () => {
      visible.value = true;
    };
    const handleOk = () => {
      visible.value = false;
    };

    return {
      visible,
      showModal,
      handleOk,
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
