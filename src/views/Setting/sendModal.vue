<template>
    <a-modal :visible="sendVisible" class="modal" title="送积分">
        <div class="user-input">
            <div class="user">
                <span>地址</span>
                <input v-model="sendParams.address" placeholder="请输入地址" required />
            </div>
            <div class="user">
                <span>积分数量</span>
                <input v-model="sendParams.count" placeholder="请输入积分数量" required type="number" />
            </div>
        </div>
        <template #closeIcon>
            <div class="close" @click="handleClose">取消</div>
        </template>
        <template #footer>
            <div class="create-user" @click="handleAddUserClick">确定</div>
        </template>
    </a-modal>
</template>

<script>
import { successNotify, warningNotify } from "@/utils";
import { defineComponent, reactive } from "vue";
import { postSendTokenApi } from "@/api/api.js";
export default defineComponent({
    props: {
        sendVisible: {
            type: Boolean,
        },
    },
    setup(props, { emit }) {
        const sendParams = reactive({
            address: "",
            count: "",
        });
        const handleClose = () => {
            emit("update:sendVisible", false);
        };
        const handleAddUserClick = async () => {
            if (sendParams.address.trim() === "") {
                return warningNotify("请输入地址");
            } else if (!sendParams.count) {
                return warningNotify("请输入数量");
            }
            const result = await postSendTokenApi(
                JSON.stringify({
                    address: sendParams.address,
                    token_number: String(sendParams.count),
                })
            );
            if (result.err_code === "0") {
                sendParams.address = "";
                sendParams.count = "";
                successNotify("发送成功");
            }
        };
        return {
            sendParams,
            handleClose,
            handleAddUserClick,
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

            &:focus {
                border: 1px solid #eee;
            }
        }
    }
}

.create-user {
    // width: 490px;
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
</style>
