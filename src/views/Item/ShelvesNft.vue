<template>
    <a-modal :visible="shelvesVisible" class="modal" title="重新上架">
        <div class="user-input">
            <div class="user">
                <span>价格</span>

                <a-input-number
                    v-model:value="price"
                    :min="0.01"
                    placeholder="请输入价格"
                    style="width: 100%"
                    type="number"
                />
            </div>
            <div class="user">
                <span>IP系列</span>
                <a-select ref="select" v-model:value="seriesIp" style="width: 100%">
                    <a-select-option value="首页">首页</a-select-option>
                    <a-select-option v-for="item in ipList" :key="item.name" :value="item.name"
                        >{{ item.name }}
                    </a-select-option>
                </a-select>
            </div>
            <div class="user">
                <span>上架时间</span>
                <a-date-picker
                    v-model:value="openingTime"
                    :bordered="false"
                    class="date-picker"
                    placeholder="请选择上架时间"
                    show-time
                />
            </div>
        </div>
        <template #closeIcon>
            <div class="close" @click="handleClose">取消</div>
        </template>
        <template #footer>
            <a-button :btnDisabled="btnDisabled" class="create-user" @click="handleAddUserClick">
                <span>上架</span>
            </a-button>
        </template>
    </a-modal>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import dayjs from "dayjs";
import { getSerisesIpApi, onShelvesNftApi } from "@api";
import { warningNotify } from "@/utils";

export default defineComponent({
    props: {
        params: {
            type: [Object, String],
        },
        shelvesVisible: {
            type: Boolean,
        },
    },
    setup(props, { emit }) {
        const currentStatus = ref(1);
        const ipList = ref([]);
        const btnDisabled = ref(false);
        const addParmas = reactive({
            price: "",
            openingTime: "",
            seriesIp: "首页",
        });

        const handleClick = (index) => {
            currentStatus.value = index;
        };
        const isBgClass = computed(() => {
            return (index) => (currentStatus.value === index ? "bgf" : "");
        });

        onMounted(() => {
            getIpList();
        });

        const getIpList = async () => {
            const { err_code, result } = await getSerisesIpApi();
            if (err_code === "0") {
                if (!result) return;
                ipList.value = result.filter((item) => item.status === "on");
            }
        };
        const initFunc = () => {
            addParmas.price = "";
            addParmas.openingTime = "";
            addParmas.seriesIp = "首页";
        };
        const handleAddUserClick = async () => {
            if (!addParmas.price) {
                warningNotify("请输入价格");
                return (btnDisabled.value = false);
            }
            if (!addParmas.openingTime) {
                warningNotify("请选择上架时间");
                return (btnDisabled.value = false);
            }

            const userSelectTime = dayjs(addParmas.openingTime).unix();
            const currentTime = dayjs(Date.now()).unix();

            if (userSelectTime < currentTime) {
                return warningNotify("请选择正确的开售时间，当前你选择的时间已过。");
            }

            const { err_code } = await onShelvesNftApi({
                opening_time: String(userSelectTime),
                price: String(addParmas.price),
                series_ip: addParmas.seriesIp === "首页" ? "" : addParmas.seriesIp,
                denom_id: String(props.params.id),
            });
            if (err_code === "0") {
                initFunc();
                emit("shelves", props.params);
            }
        };
        const handleClose = () => {
            initFunc();
            emit("cancel");
        };

        return {
            currentStatus,
            isBgClass,
            btnDisabled,
            ipList,
            handleClose,
            handleAddUserClick,
            handleClick,
            ...toRefs(addParmas),
        };
    },
});
</script>

<style lang="scss" scoped>
.user-input {
    .user {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        span {
            font-size: 14px;
            min-width: 60px;
            color: #000000;
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
    line-height: 40px;
    cursor: pointer;
    margin-bottom: 10px;
}

.close {
    font-weight: 400;
    color: #bcbcbc;
    cursor: pointer;
}

.date-picker {
    width: 100%;
    font-weight: 500;
    border: none;
    color: #000000;

    &::-webkit-input-placeholder {
        color: #999;
    }

    // text-indent: 1rem;
    border-radius: 4px;
    background-color: #fff;

    display: inline-block;
}
</style>
