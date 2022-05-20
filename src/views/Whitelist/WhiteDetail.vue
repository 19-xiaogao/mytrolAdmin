<template>
    <div class="order page-height">
        <a-breadcrumb>
            <a-breadcrumb-item>Mytrol</a-breadcrumb-item>
            <a-breadcrumb-item><router-link to="/whitelist">白名单</router-link></a-breadcrumb-item>
            <a-breadcrumb-item>{{ paramsName }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="h-r">
            <a-input
                class="input"
                placeholder="请输入需要查询的地址"
                @keydown.enter="handleQueryAddressEnter"
            ></a-input>
            <a-button type="primary" @click="handleExportClick('add')">导入数据</a-button>
            <a-button type="primary" class="btn2" @click="handleAddUserClick">添加用户</a-button>
            <a-button type="primary" danger @click="handleExportClick('remove')">删除已经导入数据</a-button>
        </div>

        <div class="content">
            <a-table
                bordered
                :columns="txColumns"
                :data-source="currentWhiteUserData"
                :pagination="false"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                :row-key="(item, index) => index"
                :scroll="{ y: scrollHeight }"
                class="tx-table"
            >
                <template #setting="{ record }">
                    <a-button type="link" @click.stop="handleRemoteToWhiteClick(record)">删除 </a-button>
                </template>
            </a-table>
        </div>
        <AddGroupModal v-model:createVisible="createWhiteVisible" @ok="handleAddWhiteListClick" />
        <AddUserModal
            v-model:createVisible="addUserVisible"
            :whitelistId="paramsId ? paramsId : ''"
            @ok="handleSureAddUserClick"
        />
        <ExportUserModal
            :btnType="isExportBtn"
            v-show="isConversionActivity"
            :whitelistId="paramsId ? paramsId : ''"
            @close="handleConversionActivityClick"
        />
    </div>
</template>

<script>
import { onMounted, ref, onUnmounted, getCurrentInstance } from "vue";

import AddGroupModal from "./AddGroupModal.vue";
import AddUserModal from "./AddUserModal.vue";
import ExportUserModal from "./ExportUserModal.vue";
import { queryAllWhiteListApi, queryWhiteListApi, addUserToWhiteListApi } from "@/api/api.js";
import { Modal } from "ant-design-vue";
const txColumns = [
    {
        title: "id",
        key: "id",
        width: "20%",
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
        AddUserModal,
        ExportUserModal,
    },
    setup() {
        const queryAddress = ref("");
        const createWhiteVisible = ref(false);
        const addUserVisible = ref(false);
        const whiteList = ref([]);
        const currentWhiteUserData = ref([]);
        const scrollHeight = ref();
        const isConversionActivity = ref(false);
        const isExportBtn = ref("add");
        const { proxy } = getCurrentInstance();
        const paramsId = proxy.$route.query.id;
        const paramsName = proxy.$route.query.name;
        onMounted(() => {
            queryWhiteList(paramsId, paramsName);
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

        const handleWhiteListClick = async (item) => {
            queryWhiteList(item.id, item.name);
        };

        const handleQueryAddressEnter = (e) => {
            if (e.target.value === "") {
                return queryWhiteList(paramsId, paramsName);
            } else {
                currentWhiteUserData.value = currentWhiteUserData.value.filter(
                    (v) => e.target.value === v.address
                );
            }
        };

        const queryWhiteList = async (id, name) => {
            const result = await queryWhiteListApi(id);

            if (result.err_code === "0") {
                if (result.result[name]) {
                    currentWhiteUserData.value = result.result[name].map((item, index) => ({
                        id: index + 1,
                        address: item,
                    }));
                } else {
                    currentWhiteUserData.value = [];
                }
            }
        };

        const handleSureAddUserClick = () => {
            queryWhiteList(paramsId, paramsName);
        };

        const handleExportClick = (type) => {
            isExportBtn.value = type;
            console.log(type);
            isConversionActivity.value = true;
        };
        const handleConversionActivityClick = (item) => {
            isConversionActivity.value = false;
            if (item) {
                return;
            }
            queryWhiteList(paramsId, paramsName);
        };
        const handleRemoteToWhiteClick = (item) => {
            Modal.confirm({
                title: "你确定想移除该用户嘛？",
                onOk() {
                    return new Promise((resolve, reject) => {
                        addUserToWhiteListApi({
                            address: item.address,
                            whitelist_id: String(paramsId),
                            action: "remove",
                        })
                            .then((res) => {
                                if (res.err_code === "0") {
                                    queryWhiteList(paramsId, paramsName);
                                    resolve();
                                }
                            })
                            .catch((err) => reject(err));
                    }).catch(() => console.log("Oops errors!"));
                },
                onCancel() {},
            });
        };
        const handleAddUserClick = () => {
            addUserVisible.value = true;
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
            addUserVisible,
            currentWhiteUserData,
            isConversionActivity,
            paramsName,
            paramsId,
            handleGroupWhiteClick,
            handleAddWhiteListClick,
            handleWhiteListClick,
            handleAddUserClick,
            handleRemoteToWhiteClick,
            handleSureAddUserClick,
            handleConversionActivityClick,
            handleQueryAddressEnter,
            handleExportClick,
            txColumns,
            isExportBtn,
        };
    },
};
</script>


<style lang="scss" scoped>
.select {
    background: #f9f9f9;
}
.h-r {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    align-items: center;
    height: 40px;
    .input {
        width: 300px;
        margin-right: 10px;
    }
    .btn2 {
        margin: 0 20px;
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