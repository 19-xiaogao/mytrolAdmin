<template>
  <div class="order">
    <div class="header">
      <h4>订单</h4>
      <div class="search-box">
        <span>编码</span>
        <input type="text" />
        <span class="icon"></span>
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
        <span>详情</span>
      </template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
const columns = [
  {
    title: "序号",
    dataIndex: "ID",
    key: "ID",
  },
  {
    title: "编码",
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
  setup() {
    const data = reactive(datas);
    return {
      columns,
      data,
    };
  },
});
</script>

<style scoped lang="scss">
.order {
  background: #fff;
  box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
  border-radius: 8px;
  border: 0px solid rgba(213, 213, 213, 0.58);
  height: 88vh;
  padding-top: 31px;
  padding-left: 44px;
  padding-right: 36px;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
  }
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
