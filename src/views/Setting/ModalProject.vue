<template>
    <a-modal :visible="projectVisible" class="modal" title="设置项目的维护状态">
        <div class="user-input">
            <p>
                <span class="setting">设置</span>
                <span class="docs"
                    >(设置以后,所有页面均不可访问,h5,小程序处于维护状态,后台管理只可以操作登录和设置)</span
                >
            </p>
            <a-switch v-model:checked="checked" checked-children="开" un-checked-children="关" />
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
import { defineComponent, onMounted, ref } from "vue";
import { setSystemStatusApi, querySystemStatusApi } from "@/api/api.js";
import { successNotify } from "@/utils";
// import { warningNotify, successNotify } from "@/utils";
export default defineComponent({
    props: {
        projectVisible: {
            type: Boolean,
        },
    },
    setup(props, { emit }) {
        const checked = ref(false);
        const handleAddUserClick = async () => {
            const result = await setSystemStatusApi({
                status: checked.value ? "maintenance" : "normal",
            });
            if (result.err_code === "0") {
                successNotify("设置成功");
                querySystemStatus();
                emit("update:projectVisible", false);
            }
        };
        const handleClose = () => {
            emit("update:projectVisible", false);
        };
        const querySystemStatus = async () => {
            const result = await querySystemStatusApi();
            console.log(result);
            if (result.err_code === "0") {
                const status = result.result.status;
                checked.value = status === "maintenance" ? true : false;
            }
        };
        onMounted(() => {
            querySystemStatus();
        });
        return {
            checked,
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
    p {
        .setting {
            color: #000000;
            font-size: 17px;
        }
        .docs {
            font-size: 14px;
            color: #bcbcbc;
        }
    }
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
