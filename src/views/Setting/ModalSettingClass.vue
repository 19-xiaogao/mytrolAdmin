<template>
    <a-modal :footer="null" :visible="classVisible" class="modal" title="设置分类">
        <div class="user-input">
            <div class="user">
                <span>添加分类</span>
                <input v-model="userClass" placeholder="请输入分类名称" type="text" />
                <a-button class="btn" @click="handleAddClassClick">确定</a-button>
            </div>
            <div class="user">
                <span style="width: 80px">已有分类</span>
                <a-select class="select" placeholder="查看分类请点击" size="large">
                    <a-select-option v-for="item in classData" :key="item.id" :value="item.name"
                        >{{ item.name }}
                    </a-select-option>
                </a-select>
            </div>
        </div>
        <template #closeIcon>
            <div class="close" @click="handleClose">取消</div>
        </template>
    </a-modal>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { addClassificationApi, getClassificationApi } from "@api";
import { successNotify, warningNotify } from "@/utils";

export default defineComponent({
    props: {
        classVisible: {
            type: Boolean,
        },
        days: {
            type: [Number, String],
        },
    },
    setup(props, { emit }) {
        const currentStatus = ref(1);
        const userClass = ref("");
        const classData = ref([]);
        const handleClose = () => {
            emit("update:classVisible", false);
        };
        const handleAddClassClick = async () => {
            if (!userClass.value.trim()) {
                return warningNotify("请输入分类的名称");
            }
            const exitClass = classData.value.find((item) => item.name === userClass.value);
            if (exitClass) {
                return warningNotify("分类名称已经存在");
            }
            const { err_code } = await addClassificationApi(userClass.value);
            if (err_code === "0") {
                getClassData();
                successNotify("添加成功");
            }
        };
        const getClassData = async () => {
            const { err_code, result } = await getClassificationApi();
            if (err_code === "0") {
                classData.value = result;
            }
        };
        watchEffect(() => {
            if (props.classVisible) {
                getClassData();
            }
        });

        return {
            currentStatus,
            handleClose,
            handleAddClassClick,
            classData,
            userClass,
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
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;

        span {
            font-size: 14px;
            color: #000000;
            width: 100px;
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

        .btn {
            height: 52px;
            margin-left: 20px;
        }

        .select {
            width: 100%;
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
