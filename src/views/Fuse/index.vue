<template>
    <div class="page-height">
        <a-breadcrumb>
            <a-breadcrumb-item>Mytrol</a-breadcrumb-item>
            <a-breadcrumb-item><router-link to="/fuse">合成</router-link></a-breadcrumb-item>
        </a-breadcrumb>
        <div class="h-r">
            <a-input placeholder="搜索合成规则" class="input"></a-input>
            <a-button class="btn" type="primary" @click="handleGroupWhiteClick">添加合成规则</a-button>
        </div>
        <AddGroupModal v-model:createVisible="createWhiteVisible" @ok="handleAddRuleListClick" />
    </div>
</template>

<script>
import AddGroupModal from "./AddRuleModal.vue";
import { ref } from "vue";
export default {
    components: {
        AddGroupModal,
    },
    setup() {
        const createWhiteVisible = ref(false);
        const handleGroupWhiteClick = () => {
            createWhiteVisible.value = true;
        };
        const handleAddRuleListClick = () => {
            console.log("=-=");
        };
        return {
            createWhiteVisible,
            handleGroupWhiteClick,
            handleAddRuleListClick,
        };
    },
};
</script>

<style lang="scss" scoped>
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
</style>