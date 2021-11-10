<template>
  <div class="page-height">
    <CreateActivityModal v-model:createVisible="createActivityVisible" />
    <IPDetail
      v-model:visible="currentIpMessage.visible"
      :params="currentIpMessage.params"
    />
    <div v-if="!currentIpMessage.visible">
      <div class="header">
        <h4>运营</h4>
        <div class="button" @click="handleCreateActivityClick">
          创建IP活动
        </div>
      </div>
      <div class="card-list">
        <div class="card-box" v-for="item in seriessList" :key="item.id">
          <div class="card">
            <div class="header">
              <p>{{ item.name }}</p>
              <span :class="isShowStatus(item.status) ? 'off-span' : ''">{{
                isShowStatus(item.status) ? "未运营" : "运营中"
              }}</span>
            </div>
            <div class="img" @click="hanleCardClick(item)">
              <img :src="item.file" alt="" />
            </div>
            <div class="footer">
              <div class="icons">
                <a-tooltip>
                  <template #title>复制链接</template>
                  <icon-svg icon="icon-a-bianzu10" class="icon"></icon-svg>
                </a-tooltip>
                <a-tooltip>
                  <template #title>{{
                    isShowStatus(item.status) ? "上架" : "下架"
                  }}</template>
                  <icon-svg
                    icon="icon-yiyouzhujici"
                    @click="handleStatusClick(item)"
                  ></icon-svg>
                </a-tooltip>
              </div>
              <a-dropdown class="serial-number">
                <template #overlay>
                  <a-menu>
                    <!-- <a-menu-item key="1">
                      1st menu item
                    </a-menu-item>
                    <a-menu-item key="2">
                      2nd menu item
                    </a-menu-item>
                    <a-menu-item key="3">
                      3rd item
                    </a-menu-item> -->
                  </a-menu>
                </template>
                <a-button>
                  <span>{{ isShowStatus(item.status) ? "无" : "下架" }}</span>
                  <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg>
                </a-button>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive } from "vue";
import { getSeriessApi, addUpdateIpApi } from "@api";
import IPDetail from "./IPDetail";
import CreateActivityModal from "./CreateActivityModal";
import { joinPreviewUrl } from "@/utils";
export default {
  components: {
    IPDetail,
    CreateActivityModal,
  },
  setup() {
    const createActivityVisible = ref(false);
    const seriessList = ref([]);
    const currentIpMessage = reactive({
      visible: false,
      params: {},
    });
    let valve = true;
    const isShowStatus = computed(() => {
      return (status) => status === "off";
    });
    onMounted(() => {
      getSeriessListApi();
    });
    const getSeriessListApi = async () => {
      const { err_code, result } = await getSeriessApi();
      if (err_code === "0") {
        seriessList.value = result.map((item) => ({
          ...item,
          file: joinPreviewUrl(item.file),
        }));
      }
    };
    const handleStatusClick = async (item) => {
      if (!valve) {
        return window.$message.warn({
          message: "提示",
          description: "请5秒后重试",
        });
      }
      valve = false;
      const status = item.status === "off" ? "on" : "off";
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("status", status);
      formData.append("number", item.number);
      formData.append("operate", "update");
      const { err_code } = await addUpdateIpApi(formData);
      if (err_code === "0") {
        window.setTimeout(() => (valve = true), 5000);
        seriessList.value.forEach((key) => {
          if (item.id === key.id) {
            item.status = status;
          }
        });
      }
    };
    const hanleCardClick = (item) => {
      currentIpMessage.visible = true;
      currentIpMessage.params = item;
    };
    const handleCreateActivityClick = () => {
      createActivityVisible.value = true;
    };
    return {
      handleCreateActivityClick,
      createActivityVisible,
      seriessList,
      isShowStatus,
      handleStatusClick,
      hanleCardClick,
      currentIpMessage,
    };
  },
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    color: #000000;
    font-size: 20px;
  }
  .button {
    width: 117px;
    height: 40px;
    background: #2f0088;
    border-radius: 8px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    color: #ffffff;
    font-size: 14px;
  }
}
.card-list {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  .card-box {
    margin-right: 26px;
    margin-top: 10px;
    .card {
      width: 260px;
      height: 248px;
      background: #ffffff;
      &:hover {
        box-shadow: 0px 0px 12px 0px rgba(106, 106, 106, 0.2);
      }
      border-radius: 13px;
      border: 1px solid #e3e3e3;
      padding: 18px 18px 14px 18px;
      text-align: center;
      box-sizing: border-box;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #000000;
        p {
          margin: 0;
          padding: 0;
          font-size: 16px;
          font-weight: 500;
        }
        .off-span {
          &::before {
            background: red !important;
          }
        }
        span {
          font-size: 14px;
          font-weight: 400;
          display: inline-block;
          position: relative;
          &::before {
            position: relative;
            top: 50%;
            left: -6px;
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #2caf71;
            border-radius: 50%;
          }
        }
      }
      .img {
        width: 224px;
        height: 142px;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
        }
      }
      .footer {
        margin-top: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icons {
          font-size: 1.2rem;
          cursor: pointer;
          font-weight: 600;
          .icon {
            margin-right: 4px;
            font-weight: 600;
          }
        }
        .serial-number {
          width: 87px;
          height: 34px;
          border-radius: 6px;
          border: 1px solid #cacaca;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 10px;
          cursor: pointer;

          .icon {
            font-size: 1rem;
          }
          span {
            font-size: 14px;
            color: #000;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>
