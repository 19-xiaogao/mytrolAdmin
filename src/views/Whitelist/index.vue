<template>
    <div class="order page-height">
        <a-breadcrumb>
            <a-breadcrumb-item>Mytrol</a-breadcrumb-item>
            <a-breadcrumb-item><router-link to="/whitelist">白名单</router-link></a-breadcrumb-item>
        </a-breadcrumb>
        <div class="h-r">
            <a-button class="btn" type="primary" @click="handleGroupWhiteClick">添加白名单分组</a-button>
        </div>
        <div class="content">
            <a-table
                :columns="whiteListColumns"
                :data-source="whiteList"
                :pagination="false"
                bordered
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                :row-key="(item, index) => index"
                :scroll="{ y: scrollHeight }"
                class="tx-table"
            >
                <template #setting="{ record }">
                    <a-button type="link" @click.stop="handleDetailClick(record.id, record.name)"
                        >查看详情</a-button
                    >
                    <a-button type="link" @click.stop="handleRenewClick(record.id)">修改白名单名称</a-button>
                </template>
            </a-table>
        </div>
        <AddGroupModal v-model:createVisible="createWhiteVisible" @ok="handleAddWhiteListClick" />
    </div>
</template>

<script>
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import AddGroupModal from "./AddGroupModal.vue";
import { queryAllWhiteListApi } from "@/api/api.js";

const whiteListColumns = [
    {
        title: "id",
        width: "10%",
        key: "id",
        dataIndex: "id",
        slots: { customRender: "id" },
    },
    {
        title: "白名单名称",
        key: "name",
        width: "30%",
        dataIndex: "name",
        slots: { customRender: "name" },
    },
    {
        title: "白名单描述",
        dataIndex: "memo",
        width: "50%",
        key: "memo",
        slots: { customRender: "memo" },
    },
    {
        title: "操作",
        dataIndex: "setting",
        key: "setting",
        width: "20%",
        slots: { customRender: "setting" },
    },
];
export default {
    components: {
        AddGroupModal,
    },
    setup() {
        const queryAddress = ref("");
        const createWhiteVisible = ref(false);
        const whiteList = ref([]);
        const currentWhiteData = ref({});
        const scrollHeight = ref();

        const router = useRouter();
        onMounted(() => {
            queryAllWhiteList();
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

        const queryAllWhiteList = async () => {
            const result = await queryAllWhiteListApi();
            if (result.err_code === "0") {
                whiteList.value = result.result;
            }
        };

        const handleDetailClick = (id, name) => {
            router.push(`/whitelist/detail?id=${id}&name=${name}`);
        };

        const handleGroupWhiteClick = () => {
            createWhiteVisible.value = true;
        };
        const handleAddWhiteListClick = () => {
            queryAllWhiteList();
        };
        return {
            queryAddress,
            whiteList,
            createWhiteVisible,
            scrollHeight,
            currentWhiteData,
            whiteListColumns,
            handleGroupWhiteClick,
            handleAddWhiteListClick,
            handleDetailClick,
        };
    },
};
</script>


<style lang="scss" scoped>
.select {
    background: #f9f9f9;
}
.h-r {
    display: flex;
    justify-content: end;
    height: 40px;
    .btn {
        margin-left: 20px;

        height: 40px;
        background-color: #2f0088;
    }
}
.content {
    margin-top: 20px;
}
.tx {
    display: flex;
    .transform-nft {
        width: 300px;
        height: 70vh;
        margin-top: 30px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        overflow-y: auto;
        .row {
            width: 100%;
            border-bottom: 1px solid #eee;
            align-items: center;
            cursor: pointer;
            padding: 5px;
            h4 {
                margin-bottom: 4px;
                color: #000000d9;
                font-size: 16px;
                margin: 0;
                padding: 0;
            }
            p {
                color: #00000073;
                font-size: 14px;
            }
        }
    }
    .white-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .btns {
            display: flex;
            .input {
                margin-right: 10px;
            }
            .btn2 {
                margin: 0 10px;
            }
        }
        .tx-table {
            width: 100%;
            margin-left: 10px;
        }
    }
}
</style>