<template>
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
      <img src="@assets/images/avtor.png" alt="" />
      <span>小龙</span>
    </template>
    <template #detail>
      <a-button type="link" @click.stop="handleOrderDetailClick">查看</a-button>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getUserOrderApi } from "@api";
const columns = [
  {
    title: "创作者",
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

export default defineComponent({
  setup() {
    const data = reactive([]);
    const isOrderShow = ref(false);
    const handleOrderDetailClick = () => {
      isOrderShow.value = !isOrderShow.value;
    };
    onMounted(() => {
      getuserOrderList();
    });
    const getuserOrderList = async () => {
      const { err_code, result } = await getUserOrderApi();
      if (err_code === "0") {
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

<style></style>
