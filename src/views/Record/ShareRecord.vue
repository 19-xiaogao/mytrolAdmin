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
      <span>小龙</span>
    </template>
    <template #detail>
      <a-button type="link" @click.stop="handleOrderDetailClick">查看</a-button>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
const columns = [
  {
    title: "序号",
    key: "make",
    slots: { customRender: "make" },
  },
  {
    title: "邀请人",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "受邀人",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "奖励",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "邀请成功时间",
    dataIndex: "buyers",
    key: "buyers",
  },
];

export default defineComponent({
  setup() {
    const data = reactive([]);
    onMounted(() => {});

    return {
      columns,
      data,
    };
  },
});
</script>

<style></style>
