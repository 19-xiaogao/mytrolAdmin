<template>
    <a-modal :visible="createVisible" class="modal" title="添加限购白名单分组">
        <div class="user-input">
            <div class="user">
                <span>白名单名称</span>
                <input v-model="groupName" placeholder="请输入白名单名称" required type="text " />
            </div>
            <div class="user">
                <span>白名单描述</span>
                <input v-model="groupDesc" placeholder="请输入白名单描述" required type="text " />
            </div>
            <div class="user">
                <span>关联nft</span>
                <a-select
                    v-model:value="selectNft"
                    mode="multiple"
                    style="width: 100%"
                    placeholder="请关联nft"
                    :options="allNft"
                    @change="handleChange"
                    option-label-prop="name"
                >
                    <template #option="{ value: val, name }">
                        <span role="img" :aria-label="val">{{ name }}</span>
                    </template>
                </a-select>
            </div>
        </div>
        <template #closeIcon>
            <div class="close" @click="handleClose">取消</div>
        </template>
        <template #footer>
            <a-button :loading="loading" class="create-user" @click="handleSureClick">确定 </a-button>
        </template>
    </a-modal>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { addLimitWhitelistApi, GetBindWhitelistNftApi } from "@/api/api.js";
import { successNotify, warningNotify } from "@/utils";

export default defineComponent({
    props: {
        createVisible: {
            type: Boolean,
        },
    },
    setup(props, { emit }) {
        const loading = ref(false);
        const groupName = ref("");
        const groupDesc = ref("");
        const allNft = ref([]);
        const selectNft = ref([]);
        const handleClose = () => {
            emit("update:createVisible", false);
        };
        const handleSureClick = async () => {
            console.log(selectNft);
            console.log(selectNft);
            console.log(selectNft);
            console.log(selectNft);
            if (groupName.value.trim() === "") {
                return warningNotify("请输入名称");
            }
            if (groupDesc.value.trim() === "") {
                return warningNotify("请输入描述");
            }
            if (selectNft.value.length <= 0) {
                return warningNotify("请关联nft");
            }

            const result = await addLimitWhitelistApi({
                name: groupName.value,
                memo: groupDesc.value,
                denom_list: selectNft.value,
            });
            if (result.err_code === "0") {
                successNotify("添加成功");
                setTimeout(() => {
                    groupName.value = "";
                    groupDesc.value = "";
                    emit("update:createVisible", false);
                    emit("ok", false);
                }, 1000);
            }
        };
        onMounted(() => {
            getAllNft();
        });

        const getAllNft = async () => {
            const result = await GetBindWhitelistNftApi();
            if (result.err_code === "0") {
                allNft.value = result.result.map((v) => ({ value: v.id, ...v }));
            }
        };
        const handleChange = (value) => {
            console.log(`selected ${value}`);
        };
        return {
            handleClose,
            groupName,
            handleSureClick,
            loading,
            groupDesc,
            selectNft,
            handleChange,
            allNft,
        };
    },
});
</script>

<style lang="scss" scoped>
.modal-create-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 52px;
    background: #f1f1f1;
    border-radius: 8px;
    padding: 7px;
    transform: translateX(40%);

    div {
        width: 112px;
        height: 38px;
        border-radius: 6px;
        line-height: 38px;
        text-align: center;
        cursor: pointer;
    }

    .bgf {
        background: #fff;
    }
}

.user-input {
    margin-top: 20px;

    .user {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10px;

        span {
            font-size: 14px;
            color: #000000;
        }

        input {
            height: 52px;
            background: #f7f7f7;
            width: 100%;
            border-radius: 8px;
            margin-top: 4px;
            box-sizing: border-box;
            padding-left: 10px;
            font-size: 14px;
        }
    }
}

.create-user {
    width: 100%;
    height: 52px;
    background: #2f0088;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    line-height: 52px;
    cursor: pointer;
    margin-bottom: 10px;
}

.close {
    font-weight: 400;
    color: #bcbcbc;
    cursor: pointer;
}

.upload-img {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #2b2b2b;
    }

    .upload-box {
        position: relative;
        width: 224px;
        height: 142px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 10px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
        }

        .upload-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            color: #fff;
            background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
            border-radius: 6px;

            input {
                position: absolute;
                width: 100%;
                height: 100%;
                cursor: pointer;
                top: 0;
                left: 0;
                opacity: 0;
                z-index: 1;
            }
        }
    }
}
</style>
