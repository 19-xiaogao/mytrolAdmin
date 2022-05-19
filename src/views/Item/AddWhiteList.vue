<template>
    <a-modal :visible="visible" class="modal" title="关联白名单">
        <div class="user-input">
            <div class="title">选择白名单</div>
            <a-select ref="select" class="user-input" v-model:value="selectValue">
                <a-select-option v-for="item in whiteList" :value="item.id" :key="item.id">{{
                    item.name
                }}</a-select-option>
            </a-select>
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
import { queryAllWhiteListApi, denomBindWhitelistApi } from "@/api/api.js";
import { successNotify } from "@/utils";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
        },
        denomId: {
            type: String || Number,
        },
    },
    setup(props, { emit }) {
        const loading = ref(false);
        const address = ref("");
        const whiteList = ref([]);
        const selectValue = ref("");
        onMounted(() => {
            queryAllWhiteList();
        });
        const handleClose = () => {
            emit("update:visible", false);
        };
        const handleSureClick = async () => {
            console.log(selectValue.value);
            console.log(props.denomId);
            const result = await denomBindWhitelistApi({
                denom_id: String(props.denomId),
                whitelist_id: String(selectValue.value),
            });
            if (result.err_code === "0") {
                successNotify("关联成功");
                setTimeout(() => {
                    emit("update:visible", false);
                }, 1000);
            }
        };

        const queryAllWhiteList = async () => {
            const result = await queryAllWhiteListApi();
            if (result.err_code === "0") {
                whiteList.value = result.result;
                selectValue.value = result.result ? result.result[0].id : "";
            }
        };
        return {
            handleClose,
            address,
            whiteList,
            selectValue,
            handleSureClick,
            loading,
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
    width: 100%;
}
.title {
    color: #000;
    font-size: 14px;
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
