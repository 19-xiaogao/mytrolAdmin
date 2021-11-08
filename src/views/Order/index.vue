<template>
  <div class="order page-height">
    <div class="header">
      <h4>订单</h4>
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
      :row-key="(item) => item.ID"
      class="ant-table-striped"
      :data-source="data"
      :position="false"
      :row-class-name="
        (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
      "
    >
      <template #make>
       <img src="@assets/images/avtor.png" alt="">
       <span>小龙</span>
      </template>
      <template #detail>
        <a-button type="link" @click.stop="handleOrderDetailClick"
          >查看</a-button
        >
      </template>
    </a-table>
    <OrderDetail v-show="isOrderShow" @clonse="handleOrderDetailClick" />
  </div>
</template>

<script>
import OrderDetail from "./OrderDetail";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getUserOrderApi } from "@api";
const columns = [
  {
    title: "创造者",
    key: "make",
    slots: { customRender: "make" },
  },
  {
    title: "订单号",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "IP主题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "买家",
    dataIndex: "buyers",
    key: "buyers",
  },
  {
    title: "金额",
    dataIndex: "money",
    key: "money",
  },
  {
    title: "成交时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "详情",
    dataIndex: "detail",
    key: "detail",
    slots: { customRender: "detail" },
  },
];
const datas = [
  {
    ID: 1,
    code: "asfadsfafs",
    title: "标题",
    author: "小龙",
    buyers: "小攻",
    money: "100元",
    time: "2021-10.12",
    status: "交易成功",
  },
];
export default defineComponent({
  name: "order",
  components: {
    OrderDetail,
  },
  setup() {
    const data = reactive(datas);
    const isOrderShow = ref(false);
    const handleOrderDetailClick = () => {
      isOrderShow.value = !isOrderShow.value;
    };
    onMounted(() => {
      getuserOrderList();
    });
    const getuserOrderList = async () => {
      const { err_code, result } = await getUserOrderApi();
      if(err_code === '0'){
        console.log(result);
      }
      console.log(result);
    };
    return {
      columns,
      data,
      handleOrderDetailClick,
      isOrderShow,
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
