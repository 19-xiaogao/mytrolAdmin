<template>
    <div class="page-height">
        <a-breadcrumb>
            <a-breadcrumb-item>Mytrol</a-breadcrumb-item>
            <a-breadcrumb-item><router-link to="/refund">退款</router-link></a-breadcrumb-item>
            <a-breadcrumb-item>退款详情</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="h-r">
            <a-radio-group v-model:value="refundChecked" @change="handleRadioCheckedChange">
                <a-radio value="all">全部</a-radio>
                <a-radio value="onRefund">已退款</a-radio>
                <a-radio value="unRefund">未退款</a-radio>
            </a-radio-group>
            <a-input
                placeholder="请输入需要查询的地址"
                class="input"
                v-model:value="searchValue"
                @keydown.enter="handleSearchEnter"
            ></a-input>
            <a-button class="btn" type="primary" @click="handleSearchEnter">搜索</a-button>
        </div>
        <div class="content">
            <a-table
                :columns="Columns"
                :data-source="refundList"
                :pagination="false"
                bordered
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                :row-key="(item, index) => index"
                :scroll="{ y: scrollHeight }"
                class="tx-table"
            >
                <template #amount="{ record }">
                    <a-tag color="#f50">{{ record.amount }} 元</a-tag>
                </template>
                <template #status="{ record }">
                    <a-tag :color="record.status ? '#108ee9' : '#f50'">{{
                        record.status ? "退款成功" : "未退款"
                    }}</a-tag>
                </template>
                <template #setting="{ record }">
                    <a-button
                        @click="handleRefundClick(record.orderid)"
                        danger
                        :disabled="record.status == 'success'"
                    >
                        退款
                    </a-button>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, onUnmounted } from "vue";
import { queryRefundOrdersApi, refundsOrderApi } from "@/api/api.js";
import { Modal } from "ant-design-vue";
import { successNotify } from "@/utils";

const Columns = [
    {
        title: "id",
        width: "4%",
        key: "id",
        dataIndex: "id",
        slots: { customRender: "id" },
    },
    {
        title: "支付地址",
        key: "address",
        width: "20%",
        dataIndex: "address",
        slots: { customRender: "address" },
    },
    {
        title: "订单编号",
        key: "orderid",
        width: "15%",
        dataIndex: "orderid",
        slots: { customRender: "orderid" },
    },
    {
        title: "价格",
        dataIndex: "amount",
        width: "5%",
        key: "amount",
        slots: { customRender: "amount" },
    },
    {
        title: "退款编号",
        dataIndex: "refund_orderid",
        width: "15%",
        key: "refund_orderid",
        slots: { customRender: "refund_orderid" },
    },
    {
        title: "退款状态",
        dataIndex: "status",
        key: "status",
        width: "10%",
        slots: { customRender: "status" },
    },
    {
        title: "操作",
        dataIndex: "setting",
        key: "setting",
        width: "10%",
        slots: { customRender: "setting" },
    },
];

export default {
    setup() {
        const { proxy } = getCurrentInstance();
        const denomId = proxy.$route.query.id;
        const refundList = ref([]);
        const scrollHeight = ref(0);
        const searchValue = ref("");
        const refundChecked = ref("all");
        onMounted(() => {
            queryRefundOrders();
        });
        onMounted(() => {
            calculateScroll();
            window.addEventListener("resize", calculateScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", calculateScroll);
        });
        const calculateScroll = function () {
            scrollHeight.value = document.body.clientWidth <= 1440 ? 470 : 550;
        };
        const queryRefundOrders = async () => {
            const result = await queryRefundOrdersApi(denomId);
            if (result.err_code === "0") {
                refundList.value = result.result;
            }
        };

        const handleRadioCheckedChange = async () => {
            if (refundChecked.value === "all") {
                return queryRefundOrders();
            }
            if (refundChecked.value === "onRefund") {
                await queryRefundOrders();
                return (refundList.value = refundList.value.filter((v) => v.status));
            }
            if (refundChecked.value === "unRefund") {
                await queryRefundOrders();
                return (refundList.value = refundList.value.filter((v) => !v.status));
            }
        };
        const handleSearchEnter = () => {
            if (searchValue.value.trim() === "") {
                refundChecked.value = "all";
                return queryRefundOrders();
            }
            refundList.value = refundList.value.filter((v) => v.address == searchValue.value.trim());
        };
        const handleRefundClick = (orderId) => {
            Modal.confirm({
                title: "你确定选择退款吗?",
                async onOk() {
                    const result = await refundsOrderApi(orderId);
                    if (result.err_code === "0") {
                        successNotify("退款成功");
                    }
                },

                onCancel() {},
            });
        };

        return {
            Columns,
            searchValue,
            refundList,
            scrollHeight,
            refundChecked,
            handleRefundClick,
            handleRadioCheckedChange,
            handleSearchEnter,
        };
    },
};
</script>

<style lang="scss" scoped>
.h-r {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    .input {
        width: 200px;
    }
    .btn {
        margin-left: 20px;
        height: 40px;
    }
}
.content {
    margin-top: 20px;
}
</style>
