<template>
    <a-modal :visible="dayVisible" class="modal" title="设置转赠天数">
        <div class="user-input">
            <div class="user">
                <span>设置转赠天数</span>
                <input
                    :value="days"
                    placeholder="请输入转赠天数"
                    required
                    type="number"
                    @change="handleInputEmit"
                />
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
import { defineComponent, ref } from "vue";
import { setGivingDayApi } from "@api";
// import { warningNotify, successNotify } from "@/utils";
export default defineComponent({
    props: {
        dayVisible: {
            type: Boolean,
        },
        days: {
            type: [Number, String],
        },
    },
    setup(props, { emit }) {
        const currentStatus = ref(1);
        const modalDays = ref(0);
        const handleClose = () => {
            emit("update:dayVisible", false);
        };
        const handleAddUserClick = async () => {
            const { err_code } = await setGivingDayApi(String(modalDays.value));
            if (err_code === "0") {
                emit("close");
            }
        };
        const handleInputEmit = (e) => {
            modalDays.value = e.target.value;
        };
        return {
            currentStatus,
            handleClose,
            handleAddUserClick,
            modalDays,
            handleInputEmit,
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
