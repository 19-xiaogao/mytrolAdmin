<template>
  <div class="order page-height">
    <div class="header">
      <h4>订单</h4>
      <div class="search-box">
        <div class="dropdown">
          <div class="current-option">
            <div class="text">编码</div>
            <div class="icon"></div>
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
import { defineComponent, reactive, ref } from "vue";
const columns = [
  {
    title: "序号",
    dataIndex: "ID",
    key: "ID",
  },
  {
    title: "订单号",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
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
          }
          .icon {
            cursor: pointer;
            width: 6px;
            height: 6px;
            border: 1px solid #151515;
            border-left-color: transparent;
            border-top-color: transparent;
            transform: translateY(-3px) rotate(45deg);
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
