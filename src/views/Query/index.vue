<template>
    <div class="order page-height">
        <div class="h-b">
            <a-input placeholder="请输入查询地址" class="input" v-model:value="queryAddress" />
            <a-button class="btn" type="primary" @click="handleQueryAddressClick">查询</a-button>
        </div>
        <div class="ms">
            <div class="ms1">
                <span>积分:</span>
                <span>{{ queryResult.token }}</span>
            </div>
            <div class="ms1">
                <span>手机号码:</span>
                <span>{{ queryResult.phone_number ? queryResult.phone_number : "暂无" }}</span>
            </div>
            <div>
                <span>状态:</span>
                <span v-if="queryResult.freezeStatus">{{
                    queryResult.freezeStatus === "false" ? "正常" : "已被冻结"
                }}</span>
                <a-button
                    v-if="queryResult.freezeStatus"
                    type="primary"
                    class="btns"
                    @click="handleFreeClick"
                    :danger="queryResult.freezeStatus === 'false'"
                    >{{ queryResult.freezeStatus === "false" ? "冻结" : "解冻" }}</a-button
                >
            </div>
        </div>
        <a-tabs>
            <a-tab-pane key="1" tab="拥有的NFT">
                <a-table
                    :columns="columns"
                    :data-source="queryResult.nfts"
                    :pagination="false"
                    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                    :row-key="(item, index) => index"
                    :scroll="{ y: scrollHeight }"
                    class="ant-table-striped"
                >
                    <template #nickname="{ record }">
                        <img :src="joinPreviewUrl(record.avatar)" alt="" class="avatar" />
                        <span>{{ record.nickname }}</span>
                    </template>
                    <template #file="{ record }">
                        <img :src="joinPreviewUrl(record.file)" alt="" class="cover" />
                    </template>
                    <template #created_at="{ record }">
                        <span>{{ dayjs(Number(record.created_at)).format("YYYY-MM-DD HH:mm:ss") }}</span>
                    </template>
                </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="交易信息">
                <div class="tx">
                    <div class="transform-nft">
                        <div
                            v-for="item in queryResult.transform"
                            :key="item.denom_id"
                            class="row"
                            @click="handleQueryTxClick(item)"
                        >
                            <img :src="joinPreviewUrl(item.avatar)" alt="" class="avatar" />
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                    <a-table
                        :columns="txColumns"
                        :data-source="txData"
                        :pagination="false"
                        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                        :row-key="(item, index) => index"
                        :scroll="{ y: scrollHeight }"
                        class="tx-table"
                    >
                        <template #time="{ record }">
                            <span>{{ dayjs(Number(record.time)).format("YYYY-MM-DD HH:mm:ss") }}</span>
                        </template>
                    </a-table>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="白名单">
                <p>当前用户在已下白名单中</p>
                <div class="white_list">
                    <div v-for="(item, index) in whiteList" :key="index" class="row">
                        <span>{{ item }}</span>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import {
    getAddressUserInfoApi,
    queryUserFreezeStatusApi,
    setUserFreezeStatusApi,
    queryWhiteListApi,
} from "@/api/api.js";
import { reactive, ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
import { successNotify } from "@/utils";

const columns = [
    {
        title: "创作者",
        key: "nickname",
        dataIndex: "nickname",
        slots: { customRender: "nickname" },
    },
    {
        title: "藏品名称",
        dataIndex: "name",
        width: 250,
        key: "name",
        slots: { customRender: "name" },
    },
    {
        title: "封面",
        dataIndex: "file",
        key: "file",
        slots: { customRender: "file" },
    },
    {
        title: "拥有时间",
        dataIndex: "created_at",
        key: "created_at",
        slots: { customRender: "created_at" },
    },
    {
        title: "拥有数量",
        dataIndex: "nft_total_number",
        key: "nft_total_number",
        slots: { customRender: "nft_total_number" },
    },
];
const txColumns = [
    {
        title: "发送方",
        key: "sender",
        dataIndex: "sender",
        slots: { customRender: "sender" },
    },
    {
        title: "接受方",
        dataIndex: "receiver",
        key: "receiver",
        slots: { customRender: "receiver" },
    },
    {
        title: "交易时间",
        dataIndex: "time",
        key: "time",
        slots: { customRender: "time" },
    },
];
const whiteColumns = [
    {
        title: "id",
        key: "id",
        dataIndex: "id",
        slots: { customRender: "id" },
    },
    {
        title: "用户地址",
        key: "address",
        dataIndex: "address",
        slots: { customRender: "address" },
    },
    {
        title: "设置",
        dataIndex: "setting",
        key: "setting",
        slots: { customRender: "setting" },
    },
];
export default {
    setup() {
        const { proxy } = getCurrentInstance();

        const queryAddress = ref("");
        const txData = ref([]);
        const queryResult = reactive({
            nfts: [],
            phone_number: "",
            token: "",
            transform: [],
            freezeStatus: false,
        });
        const scrollHeight = ref();
        const whiteList = ref([]);
        const handleQueryAddressClick = () => {
            queryUserData();
        };

        const queryUserData = async () => {
            queryUserFreezeStatusApi(queryAddress.value.trim()).then((res) => {
                if (res.err_code === "0") {
                    queryResult.freezeStatus = res.result.freeze_status;
                }
            });
            queryWhiteListApi(queryAddress.value.trim()).then((res) => {
                if (res.err_code === "0") {
                    console.log(res.result);
                    whiteList.value = res.result;
                }
            });
            getAddressUserInfoApi(queryAddress.value.trim()).then((res) => {
                if (res.err_code === "0") {
                    queryResult.nfts = res.result.nfts;
                    queryResult.phone_number = res.result.phone_number;
                    queryResult.token = res.result.token;
                    queryResult.transform = res.result.all_transfer_info;
                }
            });
        };
        const handleQueryTxClick = (item) => {
            txData.value = item.transferInfo;
        };

        onMounted(() => {
            calculateScroll();
            window.addEventListener("resize", calculateScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("resize", calculateScroll);
        });

        const handleFreeClick = async () => {
            const result = await setUserFreezeStatusApi({
                address: queryAddress.value.trim(),
                status: String(queryResult.freezeStatus === "false" ? "true" : "false"),
            });
            if (result.err_code === "0") {
                successNotify("设置成功");
                queryUserData();
            }
        };

        const calculateScroll = function () {
            scrollHeight.value = document.body.clientWidth <= 1440 ? 470 : 550;
        };
        return {
            queryAddress,
            queryResult,
            whiteList,
            columns,
            txColumns,
            whiteColumns,
            dayjs,
            scrollHeight,
            txData,
            joinPreviewUrl: proxy.joinPreviewUrl,
            handleQueryAddressClick,
            handleFreeClick,
            handleQueryTxClick,
        };
    },
};
</script>

<style scoped lang="scss">
.h-b {
    display: flex;
    height: 40px;
    .input {
        width: 500px;
        border-radius: 10px;
    }
    .btn {
        margin-left: 20px;
        width: 100px;
        height: 40px;
        background-color: #2f0088;
    }
}
.ms {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .ms1 {
        margin-right: 10px;
    }
    .btns {
        margin-left: 20px;
    }
}
.avatar {
    width: 58px;
    height: 58px;
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
    margin-right: 10px;
}
.cover {
    width: 58px;
    height: 58px;
    object-fit: cover;
    object-position: center center;
    border-radius: 10%;
    margin-right: 10px;
}
.box {
    width: 100%;
}

.tx {
    display: flex;
    .transform-nft {
        width: 400px;
        height: 70vh;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        overflow-y: auto;
        .row {
            width: 100%;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }
    .tx-table {
        flex: 1;
        margin-left: 10px;
    }
}
.white_list {
    height: 70vh;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    overflow-y: auto;

    .row {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}
</style>