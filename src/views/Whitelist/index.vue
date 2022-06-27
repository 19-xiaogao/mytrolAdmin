<template>
    <div class="order page-height">
        <a-breadcrumb>
            <a-breadcrumb-item>Mytrol</a-breadcrumb-item>
            <a-breadcrumb-item><router-link to="/whitelist">白名单</router-link></a-breadcrumb-item>
        </a-breadcrumb>
        <div class="h-r">
            <a-input placeholder="搜索白名单" class="input" @keydown.enter="handleSearchEnter"></a-input>
            <a-button class="btn" type="primary" @click="handleGroupWhiteClick">添加白名单分组</a-button>
            <a-button class="btn" type="primary" @click="handleGroupLimitWhiteClick"
                >添加限购白名单分组</a-button
            >
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
                <template #id="{ record }"> {{ record.WhiteList.id }} </template>
                <template #name="{ record }"> {{ record.WhiteList.name }} </template>
                <template #memo="{ record }"> {{ record.WhiteList.memo }} </template>
                <template #bindDenoms="{ record }">
                    <span v-if="record.BindDenoms.length === 0"> 暂无绑定作品</span>
                    <a-tag
                        closable
                        @close="handleWhiteCloseClick(item.id, record.WhiteList.id)"
                        @close.prevent
                        v-for="(item, index) in record.BindDenoms"
                        :key="index"
                        >{{ item.name }}</a-tag
                    >
                </template>

                <template #setting="{ record }">
                    <a-button
                        type="link"
                        @click.stop="handleDetailClick(record.WhiteList.id, record.WhiteList.name)"
                        >查看详情名单</a-button
                    >
                    <a-button
                        type="link"
                        @click.stop="handleAssociationClick(record.WhiteList.id, record.WhiteList.name)"
                        >关联nft作品</a-button
                    >
                    <a-button
                        type="link"
                        @click.stop="handleAssociationBindClick(record.WhiteList.id, record.WhiteList.name)"
                        >关联盲盒</a-button
                    >
                    <!-- <a-button type="link" @click.stop="handleRenewClick(record.id)">
                        <a-popover v-model:visible="record.popoverVisible" title="Title" trigger="click">
                            <template #content>
                                <a-input placeholder="修改名称"></a-input>
                            </template>
                            <a-button type="primary">修改白名单名称</a-button>
                        </a-popover>
                    </a-button> -->
                </template>
            </a-table>
        </div>
        <AddGroupModal v-model:createVisible="createWhiteVisible" @ok="handleAddWhiteListClick" />
        <AddLimitGroupModal v-model:createVisible="createWhiteLimitVisible" @ok="handleAddWhiteListClick" />
        <ExportUserModal
            :btnType="isExportBtn"
            v-show="isConversionActivity"
            :whitelistId="currentId ? currentId : ''"
            @close="handleConversionActivityClick"
        />
    </div>
</template>

<script>
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import AddGroupModal from "./AddGroupModal.vue";
import AddLimitGroupModal from "./AddLimitGroupModal.vue";
import ExportUserModal from "./ExportUserModal.vue";
import { queryAllWhiteListApi, unBindDenomWhiteListApi } from "@/api/api.js";
import { Modal } from "ant-design-vue";

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
        width: "10%",
        dataIndex: "name",
        slots: { customRender: "name" },
    },
    {
        title: "白名单描述",
        dataIndex: "memo",
        width: "10%",
        key: "memo",
        slots: { customRender: "memo" },
    },
    {
        title: "已关联的nft作品",
        dataIndex: "bindDenoms",
        width: "30%",
        key: "bindDenoms",
        slots: { customRender: "bindDenoms" },
    },
    // {
    //     title: "已关联的盲盒",
    //     dataIndex: "bindDenoms",
    //     width: "30%",
    //     key: "bindDenoms",
    //     slots: { customRender: "bindDenoms" },
    // },
    {
        title: "操作",
        dataIndex: "setting",
        key: "setting",
        width: "10%",
        slots: { customRender: "setting" },
    },
];
export default {
    components: {
        AddGroupModal,
        ExportUserModal,
        AddLimitGroupModal,
    },
    setup() {
        const queryAddress = ref("");
        const createWhiteVisible = ref(false);
        const createWhiteLimitVisible = ref(false);
        const whiteList = ref([]);
        const currentId = ref("0");
        const scrollHeight = ref();
        const popoverVisible = ref(false);
        const router = useRouter();
        const isConversionActivity = ref(false);
        const isExportBtn = ref("association");

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
                whiteList.value = result.result.map((item) => ({ ...item, popoverVisible: false }));
            }
        };

        const handleSearchEnter = (e) => {
            if (e.target.value.trim() === "") {
                return queryAllWhiteList();
            }
            whiteList.value = whiteList.value.filter((item) => item.name === e.target.value.trim());
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
        const handleAssociationClick = (id) => {
            isExportBtn.value = "association";
            currentId.value = id;
            isConversionActivity.value = true;
        };
        const handleAssociationBindClick = (id) => {
            isExportBtn.value = "bindBox";
            currentId.value = id;
            isConversionActivity.value = true;
        };
        const handleConversionActivityClick = (item) => {
            isConversionActivity.value = false;
            if (item) {
                return;
            }
            queryAllWhiteList();
        };
        const handleGroupLimitWhiteClick = () => {
            createWhiteLimitVisible.value = true;
        };

        const handleWhiteCloseClick = (denom_id, whitelist_id) => {
            Modal.confirm({
                title: "你确定想解除绑定嘛?",
                async onOk() {
                    const result = await unBindDenomWhiteListApi({
                        denom_id: String(denom_id),
                        whitelist_id: String(whitelist_id),
                    });
                    if (result.err_code === "0") {
                        queryAllWhiteList();
                    }
                },
                onCancel() {},
            });
        };
        return {
            queryAddress,
            popoverVisible,
            createWhiteLimitVisible,
            isConversionActivity,
            whiteList,
            createWhiteVisible,
            scrollHeight,
            currentId,
            isExportBtn,
            whiteListColumns,
            handleGroupWhiteClick,
            handleWhiteCloseClick,
            handleAddWhiteListClick,
            handleAssociationClick,
            handleAssociationBindClick,
            handleDetailClick,
            handleConversionActivityClick,
            handleGroupLimitWhiteClick,
            handleSearchEnter,
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
    justify-content: flex-end;
    height: 40px;
    .input {
        width: 200px;
    }
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