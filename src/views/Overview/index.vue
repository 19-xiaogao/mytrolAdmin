<template>
    <div class="overivew">
        <div class="edit-message">
            <PersonSpace />
            <EditBanner v-if="isMakerUserRules" />
            <MakeQueryBox v-else />
        </div>
        <DateAnalysis />
    </div>
</template>

<script>
import PersonSpace from "./components/PersonalSpace";
import EditBanner from "./components/EditBanner/index.vue";
import DateAnalysis from "./components/DataAnalysis";
import MakeQueryBox from "./components/MakeQueryBox";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
    components: {
        PersonSpace,
        EditBanner,
        DateAnalysis,
        MakeQueryBox,
    },
    setup() {
        const store = useStore();
        const user = computed(() => store.getters.getUser);
        const isMakerUserRules = computed(() => user.value.role !== "maker");
        return {
            isMakerUserRules,
        };
    },
};
</script>

<style lang="scss" scoped>
.overivew {
    width: 100%;
    height: 100%;
}

.edit-message {
    display: flex;
    justify-content: space-between;
}
</style>
