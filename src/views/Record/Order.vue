<template>
    <a-table
        v-model:pagination="pagination"
        :columns="columns"
        :data-source="data"
        :position="false"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :row-key="(item, index) => index"
        :scroll="{ y: scrollHeight }"
        class="ant-table-striped"
        @change="handlePaginationChange"
    >
        <template #nickname="{ record }">
            <img :src="joinPreviewUrl(record.avatar)" alt="" class="avatar" />
            <span>{{ record.nickname }}</span>
        </template>
        <template #created_at="{ text }">
            <span>{{ dayjs(Number(text)).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
        <template #vendor_payment_no="{ record }">
            <a-tooltip>
                <template #title>{{ record.vendor_payment_no }}</template>
                <div class="txt-overflow">{{ record.vendor_payment_no }}</div>
            </a-tooltip>
        </template>
        <template #buyer="{ record }">
            <a-tooltip>
                <template #title>{{ record.buyer }}</template>
                <div class="txt-overflow">{{ record.buyer }}</div>
            </a-tooltip>
        </template>

        <template #amount="{ record }">
            <a-tag color="#f50">{{ record.amount }} 元</a-tag>
        </template>
        <template #detail="{ record }">
            <a-button type="link" @click.stop="handleOrderDetailClick(record)">查看 </a-button>
        </template>
    </a-table>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, ref } from "vue";
import { getAllOrderApi, getSuccessOrderApi } from "@api";
import dayjs from "dayjs";

const columns = [
    {
        title: "创作者",
        key: "nickname",
        dataIndex: "nickname",
        slots: { customRender: "nickname" },
    },
    {
        title: "订单号",
        dataIndex: "vendor_payment_no",
        width: 250,
        key: "vendor_payment_no",
        slots: { customRender: "vendor_payment_no" },
    },
    {
        title: "买家",
        dataIndex: "buyer",
        key: "buyer",
        slots: { customRender: "buyer" },
    },
    {
        title: "金额",
        dataIndex: "amount",
        key: "amount",
        slots: { customRender: "amount" },
    },
    {
        title: "成交时间",
        dataIndex: "created_at",
        key: "created_at",
        slots: { customRender: "created_at" },
    },
    {
        title: "详情",
        dataIndex: "detail",
        key: "detail",
        slots: { customRender: "detail" },
    },
];

export default defineComponent({
    props: {
        id: String,
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const data = ref([]);
        const pagination = reactive({
            current: 1,
            numbers: 10,
            total: 0,
            defaultPageSize: 10,
            showTotal: (total) => `一共 ${total} 条`,
        });

        const scrollHeight = ref();

        const handleOrderDetailClick = (item) => {
            emit("showOrderDetailComponent", item);
        };

        const calculateScroll = function () {
            scrollHeight.value = document.body.clientWidth <= 1440 ? 470 : 650;
        };
        onMounted(() => {
            getUserOrderList(pagination);
            calculateScroll();
            window.addEventListener("resize", calculateScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", calculateScroll);
        });
        const getUserOrderList = async (pagination) => {
            if (props.id) {
                const { err_code, result } = await getSuccessOrderApi(props.id);
                if (err_code === "0") {
                    data.value = result;
                }
            } else {
                const { err_code, result } = await getAllOrderApi(pagination);
                if (err_code === "0") {
                    if (result && result.list) {
                        data.value = result.list;
                        pagination.total = Number(result.total);
                    }
                }
            }
        };
        const handlePaginationChange = ({ current }) => {
            pagination.current = current;
            if (props.id) return;
            getUserOrderList(pagination);
        };
        return {
            columns,
            data,
            handleOrderDetailClick,
            pagination,
            dayjs,
            scrollHeight,
            joinPreviewUrl: proxy.joinPreviewUrl,
            handlePaginationChange,
        };
    },
});
</script>

<style lang="scss" scoped>
.avatar {
    width: 58px;
    height: 58px;
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
    margin-right: 10px;
}
</style>
