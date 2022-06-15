<template>
    <div class="order page-height">
        <div class="header">
            <h4>审核</h4>
            <div>
                <a-radio-group v-model:value="auditStatus" @change="handleRadioChange">
                    <a-radio-button value="a">审核nft</a-radio-button>
                    <a-radio-button value="b">审核盲盒</a-radio-button>
                </a-radio-group>
            </div>
            <div class="search-box">
                <div class="dropdown">
                    <div class="current-option">
                        <a-dropdown class="text">
                            <template #overlay>
                                <a-menu @click="handleSelectClick">
                                    <a-menu-item v-for="item in queryParams" :key="item.key">
                                        {{ item.title }}
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button>
                                <span class="span">{{ currentQueryParams.title }}</span>
                                <div class="icon"></div>
                            </a-button>
                        </a-dropdown>
                    </div>
                </div>
                <div class="search">
                    <span class="line"></span>
                    <input v-model="queryValue" class="input" type="text" />
                    <span class="icon" @click="handleSearchClick">
                        <img alt="" src="@assets/images/search.png" />
                    </span>
                </div>
            </div>
        </div>
        <a-table
            v-model:pagination="pagination"
            :columns="columns"
            :data-source="publishData"
            :position="false"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            :row-key="(item) => item.id"
            :scroll="{ y: scrollHeight }"
            @change="handlePaginationChange"
        >
            <template #price="{ record }">
                <a-tag color="#f50">{{ record.price }} 元</a-tag>
            </template>
            <template #detail="record">
                <a-button type="link" @click.stop="handleOrderDetailClick(record)">查看 </a-button>
            </template>
        </a-table>
        <AuditDetail
            v-if="isOrderShow"
            v-model:messageDetail="detailMessage"
            v-model="auditStatus"
            @clonse="handleCloseClick"
        />
    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs } from "vue";
import dayjs from "dayjs";

import { joinPreviewUrl } from "@/utils";
import { getPublishingApi, getBindBoxNftPublishingApi } from "@api";
import AuditDetail from "./AuditDetail";

const columns = [
    {
        title: "序号",
        dataIndex: "index",
        key: "index",
        with: 50,
    },
    {
        title: "创作者",
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
        slots: { customRender: "price" },
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
const queryList = [
    {
        title: "全部",
        key: "all",
    },
    {
        title: "名称",
        key: "nickname",
    },
    {
        title: "标题",
        key: "name",
    },
    {
        title: "关联IP",
        key: "series_ip",
    },
    {
        title: "价格",
        key: "price",
    },
    {
        title: "数量",
        key: "number",
    },
];

export default defineComponent({
    name: "order",
    components: {
        AuditDetail,
    },

    setup() {
        let publishData = ref([]);
        let pagination = reactive({
            current: 1,
            numbers: 10,
            total: 0,
            defaultPageSize: 10,
            showTotal: (total) => `一共 ${total} 条`,
        });
        const auditStatus = ref("a");
        let currentItemDetail = reactive({ isOrderShow: false, detailMessage: {} });

        const queryParams = ref(queryList);
        const currentQueryParams = ref(queryList[0]);

        const queryValue = ref();
        const scrollHeight = ref();

        const handleSelectClick = ({ key }) => {
            currentQueryParams.value = queryList.find((item) => item.key === key);
        };
        const handlePaginationChange = ({ current }) => {
            pagination.current = current;
            getPublishingList(pagination);
        };
        const handleSearchClick = () => {
            if (currentQueryParams.value.key === "all") {
                return getPublishingList(pagination);
            }
        };
        const calculateScroll = function () {
            scrollHeight.value = document.body.clientWidth <= 1440 ? 470 : 700;
        };

        onMounted(() => {
            getPublishingList(pagination);
            calculateScroll();
            window.addEventListener("resize", calculateScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", calculateScroll);
        });
        const handleRadioChange = () => {
            getPublishingList(pagination);
        };
        const assignmentFunc = (result) => {
            // no data ,result is array.
            if (Array.isArray(result)) {
                pagination.total = result.length;
                publishData.value = result;
                return;
            }
            pagination.total = result.total;
            publishData.value = result.list.map((item, index) => ({
                ...item,
                opening_time: dayjs(Number(item.opening_time) * 1000).format("YYYY-MM-DD HH:mm"),
                series_ip: item.series_ip === "common" ? "首页" : item.series_ip,
                avatar: joinPreviewUrl(item.avatar),
                index: index + 1,
            }));
        };
        const getPublishingList = async (pagination) => {
            if (auditStatus.value === "a") {
                const { err_code, result } = await getPublishingApi(pagination);
                if (err_code === "0") {
                    assignmentFunc(result);
                }
            } else {
                const { err_code, result } = await getBindBoxNftPublishingApi(pagination);
                console.log(result);
                if (err_code === "0") {
                    assignmentFunc(result);
                }
            }
        };
        const handleOrderDetailClick = (row) => {
            currentItemDetail.detailMessage = row.record;
            currentItemDetail.isOrderShow = !currentItemDetail.isOrderShow;
        };
        const handleCloseClick = async (refresh) => {
            if (refresh) {
                // 由于区块链有延迟,所以递归查询数据
                getPublishingList(pagination);
            }
            currentItemDetail.isOrderShow = !currentItemDetail.isOrderShow;
        };
        return {
            columns,
            publishData,
            handleOrderDetailClick,
            handleCloseClick,
            queryParams,
            currentQueryParams,
            handleSelectClick,
            handleSearchClick,
            queryValue,
            scrollHeight,
            pagination,
            auditStatus,
            ...toRefs(currentItemDetail),
            handlePaginationChange,
            handleRadioChange,
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
    }
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>
