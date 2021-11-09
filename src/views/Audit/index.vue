<template>
  <div class="order page-height">
    <div class="header">
      <h4>审核</h4>
      <div class="search-box">
        <div class="dropdown">
          <div class="current-option">
            <!-- <div class="text">编码</div> -->
            <a-dropdown class="text">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    1st menu item
                  </a-menu-item>
                  <a-menu-item key="2">
                    2nd menu item
                  </a-menu-item>
                  <a-menu-item key="3">
                    3rd item
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <span class="span">编码</span>
                <div class="icon"></div>
                <!-- <icon-svg icon="icon-a-bianzu13" class="icon"></icon-svg> -->
              </a-button>
            </a-dropdown>
          </div>
        </div>
        <div class="search">
          <span class="line"></span>
          <input type="text" class="input" />
          <span class="icon">
            <img src="@assets/images/search.png" alt="" />
          </span>
        </div>
      </div>
    </div>
    <a-table
      :columns="columns"
      :row-key="(item) => item.id"
      class="ant-table-striped"
      :data-source="publishData"
      :position="false"
      :scroll="{ y: 450 }"
      :row-class-name="
        (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
      "
    >
      <template #detail="record">
        <a-button type="link" @click.stop="handleOrderDetailClick(record)"
          >查看</a-button
        >
      </template>
    </a-table>
    <AuditDetail
      v-if="isOrderShow"
      v-model:messageDetail="detailMessage"
      @clonse="hanldeCloseClick"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, toRefs } from "vue";
import { joinPreviewUrl } from "@/utils";
import { getPublishingApi } from "@api";
import dayjs from "dayjs";
import AuditDetail from "./AuditDetail";
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "名称",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "标题",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "关联IP",
    dataIndex: "series_ip",
    key: "series_ip",
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "数量",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "上架时间",
    dataIndex: "opening_time",
    key: "opening_time",
  },
  {
    title: "详情",
    dataIndex: "detail",
    key: "detail",
    slots: { customRender: "detail" },
  },
];
export default defineComponent({
  name: "order",
  components: {
    AuditDetail,
  },

  setup() {
    let publishData = ref([]);
    let pagination = reactive({ page: 1, numbers: 10 });
    let currentDetail = reactive({ isOrderShow: false, detailMessage: {} });
    onMounted(() => {
      getPublishingList(pagination);
    });
    const getPublishingList = async (pagination) => {
      const { err_code, result } = await getPublishingApi(pagination);
      if (err_code === "0") {
        publishData.value = result.map((item) => ({
          ...item,
          opening_time: dayjs(Number(item.opening_time) * 1000).format(
            "YYYY-MM-DD HH:mm"
          ),
          series_ip: item.series_ip === "common" ? "首页" : item.series_ip,
          avatar: joinPreviewUrl(item.avatar),
        }));
        console.log("审核列表", publishData.value);
      }
    };
    const handleOrderDetailClick = (row) => {
      currentDetail.detailMessage = row.record;
      currentDetail.isOrderShow = !currentDetail.isOrderShow;
    };
    const hanldeCloseClick = (refresh, id) => {
      if (refresh) {
        // 由于区块链有延迟，所以删除内存的这个条数据
        // getPublishingList(pagination);
        publishData.value = publishData.value.filter((item) => item.id !== id);
      }
      currentDetail.isOrderShow = !currentDetail.isOrderShow;
    };
    return {
      columns,
      publishData,
      handleOrderDetailClick,
      hanldeCloseClick,
      ...toRefs(currentDetail),
    };
  },
});
</script>

<style scoped lang="scss">
.order {
  border-radius: 8px;
  padding-top: 31px;
  padding-left: 44px;
  padding-right: 36px;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    .search-box {
      width: 301px;
      height: 40px;
      background: #f1f1f1;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dropdown {
        width: 20%;
        .current-option {
          display: flex;
          justify-content: center;
          align-items: center;
          .text {
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f1f1f1;
            border: none;
            box-sizing: border-box;
          }

          .icon {
            cursor: pointer;
            width: 6px;
            height: 6px;
            border: 1px solid #151515;
            border-left-color: transparent;
            border-top-color: transparent;
            transition: all 0.3s;
            transform: translate(10px, -3px) rotate(45deg);
          }
        }
      }
      .search {
        flex: 1;
        text-align: left;
        padding-left: 4px;
        display: flex;
        align-items: center;
        .line {
          display: inline-block;
          width: 1px;
          height: 16px;
          background: #d8d8d8;
          border-radius: 1px;
          border: 1px solid #c7c7c7;
        }
        .input {
          margin-left: 5px;
          width: 80%;
        }
        .icon {
          cursor: pointer;
        }
      }
    }
  }
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
