<template>
    <a-modal :visible="createVisible" class="modal" title="添加用户">
        <div class="user-input">
            <div class="user">
                <span>用户地址</span>
                <input v-model="address" placeholder="请输入地址" required type="text " />
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
import { defineComponent, ref } from "vue";
import { addUserToWhiteListApi } from "@/api/api.js";
import { successNotify, warningNotify } from "@/utils";
export default defineComponent({
    props: {
        createVisible: {
            type: Boolean,
        },
        whitelistId: {
            type: Number || String,
        },
    },
    setup(props, { emit }) {
        const loading = ref(false);
        const address = ref("");

        const handleClose = () => {
            emit("update:createVisible", false);
        };
        const handleSureClick = async () => {
            if (address.value.trim() === "") {
                return warningNotify("请输入名称");
            }
            const result = await addUserToWhiteListApi({
                address: address.value,
                whitelist_id: String(props.whitelistId),
                action: "add",
            });
            if (result.err_code === "26") {
                return warningNotify("用户已经存在");
            }
            if (result.err_code === "0") {
                successNotify("添加成功");
                setTimeout(() => {
                    address.value = "";
                    emit("update:createVisible", false);
                    emit("ok", false);
                }, 1000);
            }
        };
        return {
            handleClose,
            address,
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
