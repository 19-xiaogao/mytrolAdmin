<template>
  <a-modal :visible="createVisible" class="modal" title="开账号">
    <div class="modal-create-header">
      <div @click="handleClick(1)" :class="isBgClass(1)">设计师账号</div>
      <div @click="handleClick(2)" :class="isBgClass(2)">运营账号</div>
    </div>
    <div class="user-input">
      <div class="user">
        <span>用户账号</span>
        <input type="text " placeholder="请输入您的设计师账号" />
      </div>
      <div class="user">
        <span>用户密码</span>
        <input type="text " placeholder="请输入您的设计师密码" />
      </div>
    </div>
    <template #closeIcon>
      <div class="close" @click="handleClose">取消</div>
    </template>
    <template #footer>
      <div class="create-user">生成</div>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    createVisible: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const currentStatus = ref(1);
    const handleClick = (index) => {
      currentStatus.value = index;
    };
    const isBgClass = computed(() => {
      return (index) => (currentStatus.value === index ? "bgf" : "");
    });
    const handleClose = () => {
      emit("update:createVisible", false);
    };
    return { currentStatus, handleClick, isBgClass, handleClose };
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
  // width: 490px;
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
</style>
