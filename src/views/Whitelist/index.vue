<template>
    <div class="order page-height">
        <div class="h-r">
            <a-button class="btn" type="primary" @click="handleGroupWhiteClick">添加白名单分组</a-button>
        </div>
        <div class="content">
            <div class="tx">
                <div class="transform-nft">
                    <div
                        v-for="item in whiteList"
                        :key="item.id"
                        class="row"
                        @click="handleWhiteListClick(item)"
                    >
                        <h4>{{ item.name }}</h4>
                        <p>{{ item.memo }}</p>
                    </div>
                </div>
                <div class="white-content">
                    <div class="btns">
                        <a-button type="primary">导入数据</a-button>
                        <a-button type="primary" class="btn2" @click="handleAddUserClick">添加用户</a-button>
                    </div>
                    <a-table
                        :columns="txColumns"
                        :data-source="currentWhiteUserData"
                        :pagination="false"
                        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                        :row-key="(item, index) => index"
                        class="tx-table"
                    >
                        <template #setting="{ record }">
                            <a-button type="link" @click.stop="handleRemoteToWhiteClick(record)"
                                >删除
                            </a-button>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
        <AddGroupModal v-model:createVisible="createWhiteVisible" @ok="handleAddWhiteListClick" />
        <AddUserModal
            v-model:createVisible="addUserVisible"
            :whitelistId="currentWhiteData.id"
            @ok="handleSureAddUserClick"
        />
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
import AddGroupModal from "./AddGroupModal.vue";
import AddUserModal from "./AddUserModal.vue";
import { queryAllWhiteListApi, queryWhiteListApi, addUserToWhiteListApi } from "@/api/api.js";
import { Modal } from "ant-design-vue";
const txColumns = [
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
    components: {
        AddGroupModal,
        AddUserModal,
    },
    setup() {
        const queryAddress = ref("");
        const createWhiteVisible = ref(false);
        const addUserVisible = ref(false);
        const whiteList = ref([]);
        const currentWhiteUserData = ref([]);
        const currentWhiteData = ref({});
        onMounted(() => {
            queryAllWhiteList();
        });

        const queryAllWhiteList = async () => {
            const result = await queryAllWhiteListApi();
            if (result.err_code === "0") {
                whiteList.value = result.result;
            }
        };

        const handleWhiteListClick = async (item) => {
            currentWhiteData.value = item;
            queryWhiteList(item.id, item.name);
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
            queryWhiteList(currentWhiteData.value.id, currentWhiteData.value.name);
        };

        const handleRemoteToWhiteClick = (item) => {
            Modal.confirm({
                title: "你确定想移除该用户嘛？",
                onOk() {
                    return new Promise((resolve, reject) => {
                        addUserToWhiteListApi({
                            address: item.address,
                            whitelist_id: String(currentWhiteData.value.id),
                            action: "remove",
                        })
                            .then((res) => {
                                if (res.err_code === "0") {
                                    queryWhiteList(currentWhiteData.value.id, currentWhiteData.value.name);
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
            console.log("添加分组");
            createWhiteVisible.value = true;
        };
        const handleAddWhiteListClick = () => {
              queryAllWhiteList();
        };
        return {
            queryAddress,
            whiteList,
            createWhiteVisible,
            addUserVisible,
            currentWhiteData,
            currentWhiteUserData,
            handleGroupWhiteClick,
            handleAddWhiteListClick,
            handleWhiteListClick,
            handleAddUserClick,
            handleRemoteToWhiteClick,
            handleSureAddUserClick,
            txColumns,
        };
    },
};
</script>


<style lang="scss" scoped>
.h-r {
    display: flex;
    justify-content: start;
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
            padding: 4px;
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
            .btn2 {
                margin-left: 10px;
            }
        }
        .tx-table {
            width: 100%;
            margin-left: 10px;
        }
    }
}
</style>