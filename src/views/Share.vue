<template>
    <div class="order page-height">
        <div class="header">
            <div class="switch-table">
                <h4 :class="renderCurrentActive(0)" @click="handleSwitchTableClick(0)">订单数据</h4>
            </div>
        </div>
        <a-table
            :columns="columns"
            :data-source="data"
            :position="false"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            :row-key="(item, index) => index"
            :scroll="{ y: scrollHeight }"
            class="ant-table-striped"
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
                <a-button type="link" @click.stop="handleShowOrderDetailComponent(record)">查看 </a-button>
            </template>
        </a-table>
        <OrderDetail v-if="isOrderShow" :orderItem="currentOrderItem" @close="handleOrderDetailClick" />
    </div>
</template>

<script>
import OrderDetail from "./Record/OrderDetail";
import { computed, defineComponent, onMounted, ref, onUnmounted, getCurrentInstance } from "vue";
import { getSuccessOrderApi } from "@api";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { getQueryVariable, warningNotify } from "@/utils";
const columns = [
    {
        title: "作品名称",
        key: "nft_name",
        dataIndex: "nft_name",
    },
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
    name: "record",
    components: {
        OrderDetail,
    },
    setup() {
        const currentTableIndex = ref(0);
        const isOrderShow = ref(false);
        const currentOrderItem = ref({});

        const data = ref([]);

        const { proxy } = getCurrentInstance();
        const router = useRoute();

        const scrollHeight = ref();

        const handleOrderDetailClick = () => {
            isOrderShow.value = !isOrderShow.value;
        };
        onMounted(() => {
            console.log(router.params);
        });
        const renderCurrentActive = computed(
            () => (index) => index === currentTableIndex.value ? "active" : ""
        );
        const handleSwitchTableClick = (index) => (currentTableIndex.value = index);

        const handleShowOrderDetailComponent = (item) => {
            isOrderShow.value = true;
            currentOrderItem.value = item;
        };

        const calculateScroll = function () {
            scrollHeight.value = document.body.clientWidth <= 1440 ? 570 : 750;
        };
        onMounted(() => {
            getUserOrderList();
            calculateScroll();
            window.addEventListener("resize", calculateScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", calculateScroll);
        });
        const getUserOrderList = async () => {
            const id = getQueryVariable("id");
            const access_token = getQueryVariable("access_token");
            const { err_code, result } = await getSuccessOrderApi(`${id}?access_token=${access_token}`);
            if (err_code === "0") {
                if (Array.isArray(result)) {
                    data.value = result;
                }
            } else {
                warningNotify("分享时间已经过期");
            }
        };

        return {
            handleOrderDetailClick,
            isOrderShow,
            renderCurrentActive,
            handleSwitchTableClick,
            currentTableIndex,
            currentOrderItem,
            handleShowOrderDetailComponent,
            columns,
            data,
            dayjs,
            scrollHeight,
            joinPreviewUrl: proxy.joinPreviewUrl,
        };
    },
});
</script>

<style lang="scss" scoped>
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

        .switch-table {
            display: flex;
            justify-content: space-between;

            h4 {
                font-size: 16px;
                font-weight: 500;
                color: #7e7e7e;
                // width: 70px;
                height: 100%;
                text-align: center;
                margin: 0;
                padding: 0;
                margin-right: 40px;
                cursor: pointer;
            }

            .active {
                font-weight: 500;
                border-bottom: 2px solid #ff451d;
                color: #151515;
            }
        }
    }
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>
