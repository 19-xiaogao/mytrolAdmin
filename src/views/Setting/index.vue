<template>
  <div class="page-height">
    <h3 class="title">设置</h3>
    <div class="setting_list">
      <div
        :class="isShowActiveClass(index)"
        v-for="(item, index) in settingLists"
        :key="item.text"
        @click="handleClick(index)"
      >
        <icon-svg :icon="item.icon" class="icon" />
        <span>{{ item.text }}</span>
      </div>
    </div>
    <ModalUser v-model:createVisible="createVisible" />
    <ModalSettingDay
      v-model:dayVisible="dayVisible"
      v-model:days="days"
      @close="handleCloseEmit"
    />
  </div>
</template>

<script>
const settingList = [
  {
    icon: "icon-setting-icon1",
    text: "新增管理员",
  },
  {
    icon: "icon-setting-icon2",
    text: "信息",
  },
  {
    icon: "icon-setting-icon3",
    text: "二级密码",
  },
  {
    icon: "icon-a-bianzu9beifen4",
    text: "转赠天数",
  },
];
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { queryGivingDayApi } from "@api";
import { pollingGivingDaysApi } from "@/api/pllingApi";
import ModalUser from "./ModalUser";
import ModalSettingDay from "./ModalSettingDay";
export default defineComponent({
  components: {
    ModalUser,
    ModalSettingDay,
  },
  setup() {
    const currentIndex = ref(-1);
    const settingLists = reactive(settingList);
    const createVisible = ref(false);
    const days = ref(0);
    const dayVisible = ref(false);
    const isShowActiveClass = computed(() => {
      return (index) => (currentIndex.value === index ? "ms active" : "ms");
    });
    const handleClick = (index) => {
      currentIndex.value = index;
      if (index === 0) {
        createVisible.value = true;
      }
      if (index === 3) {
        dayVisible.value = true;
      }
    };
    onMounted(() => {
      queryDay();
    });
    const settingDays = (result) => {
      days.value = result.days ? result.days : 0;
      settingLists[settingLists.length - 1].text = `转赠天数(${days.value}天)`;
    };
    const queryDay = async () => {
      const { result, err_code } = await queryGivingDayApi();
      if (err_code === "0") {
        settingDays(result);
      }
    };

    const handleCloseEmit = () => {
      dayVisible.value = false;
      pollingGivingDaysApi(days.value, (result) => {
        settingDays(result);
      });
    };

    return {
      isShowActiveClass,
      handleClick,
      settingLists,
      createVisible,
      dayVisible,
      days,
      handleCloseEmit,
    };
  },
});
</script>

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  line-height: 30px;
}
.setting_list {
  margin-top: 24px;
  display: flex;

  .ms {
    width: 148px;
    height: 148px;
    background: #ffffff;
    margin-right: 20px;
    border-radius: 12px;
    border: 1px solid #e3e3e3;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:hover {
      border: 1px solid #2f0088;
      span:last-child {
        font-size: 16px;
        color: #2f0088;
        font-weight: 400;
      }
      .icon {
        color: #2f0088;
      }
    }

    .icon {
      font-size: 3.4rem;
    }
    span:last-child {
      font-size: 16px;
      color: #000000;
      font-weight: 400;
    }
  }
  .active {
    background: #2f0088;
    border: 1px solid #2f0088;

    span:last-child {
      font-size: 16px;
      color: #fff;
    }
    .icon {
      color: #fff;
    }
    &:hover {
      border: 1px solid #2f0088;
      span:last-child {
        font-size: 16px;
        color: #fff;
        font-weight: 400;
      }
      .icon {
        color: #fff;
      }
    }
  }
}
</style>
