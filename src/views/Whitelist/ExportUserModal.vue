<template>
    <div ref="conversionRef" class="operation-activity">
        <div class="header">
            <span class="title">{{
                btnType === "association" || btnType === "bindBox" ? "白名单于作品关联" : "将用户数据导入白名单"
            }}</span>
            <icon-svg class="icon" icon="icon-a-bianzu101" @click="handleHideClick"></icon-svg>
        </div>
        <div class="input-search">
            <a-input
                placeholder="输入需要查找的nft"
                v-model:value="searchValue"
                @keydown.enter="handleEnterClick"
            ></a-input>
            <a-button type="primary" @click="handleEnterClick">查询</a-button>
        </div>
        <div class="nft-list">
            <div
                class="card"
                v-for="(item, index) in worksList"
                :key="item.id"
                @click="handleSelectedClick(index)"
            >
                <div :ref="String(item.id)" class="img">
                    <img :src="item.file" alt="" />
                </div>

                <div class="me">
                    <div class="me-t">
                        <h3>{{ item.name }}</h3>
                        <div class="avator-des">
                            <div class="imgs">
                                <img :src="item.author_avatar" alt="" />
                                <img alt="" class="icon" src="@assets/images/v-icon.png" />
                            </div>
                            <span class="txt-overflow" style="width: 100px">{{ item.author_nickname }}</span>
                        </div>
                    </div>
                    <div class="me-m">
                        <div class="manay">{{ item.price }}$</div>
                        <div class="_limit">
                            <div class="_t1">限量</div>
                            <div class="_t2">{{ item.number }}</div>
                        </div>
                    </div>
                </div>
                <div class="mask"></div>
                <div class="select-mask" v-if="item.selected">
                    <div class="s-m-t">已选中</div>
                </div>
            </div>
        </div>
        <a-button :loading="loading" class="save-setting" @click="handleSaveSettingClick">
            <icon-svg icon="icon-save"></icon-svg>
            {{ btnText }}
        </a-button>
    </div>
</template>

<script>
import { onMounted, onUpdated, ref, getCurrentInstance, computed } from "vue";
import { GetAdminAllNftApi, queryNftHoldersApi, queryNftApi, denomBindWhitelistApi,bindBoxWhitelistApi } from "@/api/api.js";
import { addUserToWhiteListPollingApi } from "@/api/pllingApi.js";
// import { useStore } from "vuex";
import { successNotify, warningNotify } from "@/utils";
export default {
    emits: ["close"],

    props: {
        whitelistId: {
            type: Number || String,
        },
        btnType: {
            type: String,
        },
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        // const store = useStore();

        const conversionRef = ref(null);
        const loading = ref(false);
        const worksList = ref([]);
        const searchValue = ref("");
        const handleHideClick = () => {
            conversionRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
            worksList.value.forEach((item) => {
                item.selected = false;
            });
            searchValue.value = "";
            setTimeout(() => {
                emit("close", "close");
            }, 400);
        };

        // const user = computed(() => store.getters.getUser);
        const btnText = computed(() => {
            if (props.btnType === "association" || props.btnType === "bindBox") {
                return "关联";
            } else if (props.btnType === "add") {
                return "导入";
            } else {
                return "删除";
            }
        });
        onUpdated(() => {
            conversionRef.value.style.animation = "sliding-show 0.5s linear 0s";
        });

        onMounted(() => {
            getWorksList();
        });

        const returnPrivateTableData = (result) => {
            return result.map((item) => ({
                ...item,
                file: proxy.joinPreviewUrl(item.file),
                author_avatar: proxy.joinPreviewUrl(item.author_avatar),
                selected: false,
            }));
            // .filter((item) => item.publish === "2" && item.free === "false");
        };

        const getWorksList = async () => {
            const { err_code, result } = await GetAdminAllNftApi(1, 30);
            if (err_code === "0") {
                worksList.value = returnPrivateTableData(result.list);
            }
        };

        const handleEnterClick = async () => {
            if (searchValue.value.trim() === "") {
                return getWorksList();
            }
            const { err_code, result } = await queryNftApi({
                field: "name",
                value: searchValue.value,
            });
            if (err_code === "0") {
                worksList.value = returnPrivateTableData(result.list);
            }
        };

        const handleSaveSettingClick = async () => {
            const findData = worksList.value.find((item) => item.selected);
            if (!findData) return warningNotify("请选择作品");
            if (props.btnType === "association") {
                const result = await denomBindWhitelistApi({
                    denom_id: String(findData.id),
                    whitelist_id: String(props.whitelistId),
                });
                if (result.err_code === "0") {
                    successNotify("关联成功");
                    searchValue.value = "";
                    getWorksList();
                    emit("close");
                }
            } else if (props.btnType === "bindBox") {
                const result = await bindBoxWhitelistApi({
                    denom_id: String(findData.id),
                    whitelist_id: String(props.whitelistId),
                });
                if (result.err_code === "0") {
                    successNotify("关联成功");
                    searchValue.value = "";
                    getWorksList();
                    emit("close");
                }
            } else {
                loading.value = true;
                const result = await queryNftHoldersApi(String(findData.id));
                const deduplicationData = new Set(result.result);
                if (result.err_code === "0") {
                    for await (let item of deduplicationData) {
                        try {
                            await addUserToWhiteListPollingApi({
                                action: props.btnType,
                                address: item, // 用户id
                                whitelist_id: String(props.whitelistId), // 白名单列表
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    loading.value = false;
                    if (props.btnType === "add") {
                        successNotify("导入成功");
                    } else {
                        successNotify("删除成功");
                    }
                    searchValue.value = "";
                    getWorksList();
                    emit("close");
                }
            }
        };
        const handleSelectedClick = (index) => {
            const selectedNumber = worksList.value.filter((item) => item.selected).length;
            worksList.value.forEach((item) => {
                if (selectedNumber < 1) {
                    worksList.value[index].selected = true;
                } else {
                    item.selected = false;
                    worksList.value[index].selected = true;
                }
            });
        };

        return {
            searchValue,
            handleHideClick,
            conversionRef,
            loading,
            worksList,
            btnText,
            handleSaveSettingClick,
            handleEnterClick,
            handleSelectedClick,
        };
    },
};
</script>
<style lang="scss" scoped>
.operation-activity {
    position: absolute;
    right: 10px;
    top: 4px;
    width: 590px;
    height: calc(100% - 4px);
    background: #ffffff;
    box-shadow: -6px 0px 18px 0px rgba(107, 107, 107, 0.16);
    border-radius: 12px;
    box-sizing: border-box;
    padding: 0 21px;
    animation: sliding-show 0.5s linear 0s;
    z-index: 11;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        left: 0;
        background: #fff;
        height: 50px;
        width: 105%;

        .title {
            font-size: 18px;
            font-weight: 500;
            color: #000000;
        }

        .icon {
            font-size: 1.6rem;
            cursor: pointer;
        }
    }
    .input-search {
        margin: 10px;
        display: flex;
    }
    .nft-list {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        height: 80%;
        overflow-y: auto;
        .card {
            width: 242px;
            height: 242px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
            box-shadow: 0px 2px 6px 0px rgba(53, 53, 53, 0.09);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            margin-right: 6px;
            margin-bottom: 6px;

            .img {
                width: 100%;
                height: 100%;
                transition: all 0.3s;
                z-index: 1;
                cursor: pointer;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 50% 50%;
                }
            }

            .options {
                position: absolute;
                top: 11px;
                right: 2px;
                z-index: 2;
                width: 92px;
                height: 34px;
                background: rgba(0, 0, 0, 0.68);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                box-sizing: border-box;
                padding: 9px 10px;
                cursor: pointer;

                img {
                    width: 16px;
                    height: 16px;
                }

                .text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #ffd36c !important;
                }

                .icon {
                    color: #fff;
                }
            }

            .me {
                display: flex;
                position: absolute;
                width: calc(100% - 25px);
                justify-content: space-between;
                align-items: center;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;

                .me-t {
                    h3 {
                        font-size: 14px;
                        font-weight: 500;
                        color: #fff;
                        margin: 0;
                        padding: 0;
                    }

                    .avator-des {
                        display: flex;
                        align-items: center;
                        margin-top: 6px;

                        .imgs {
                            position: relative;
                            width: 20px;
                            height: 20px;

                            img:first-child {
                                width: 100%;
                                width: 100%;
                                border-radius: 50%;
                                position: absolute;
                                top: 0;
                                left: 0;
                            }

                            .icon {
                                width: 10px;
                                height: 10px;
                                position: absolute;
                                top: 50%;
                                right: -10px;
                                transform: translateX(-50%);
                            }
                        }

                        span {
                            font-size: 12px;
                            color: #fff;
                            display: inline-block;
                            margin-left: 10px;
                        }
                    }
                }

                .me-m {
                    margin-left: 20px;

                    .manay {
                        font-size: 19px;
                        color: #fff;
                        font-weight: 500;
                        text-align: right;
                    }

                    ._limit {
                        height: 20px;
                        border-radius: 6px;
                        border: 1px solid #ffbd21;
                        display: flex;
                        text-align: right;

                        ._t1 {
                            display: block;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #000000;
                            line-height: 20px;
                            background: #ffbd21;
                            padding: 0 4px;
                        }

                        ._t2 {
                            display: block;
                            height: 20px;
                            font-size: 12px;
                            font-family: Roboto-Medium, Roboto;
                            font-weight: 500;
                            color: #ffbd21;
                            line-height: 20px;
                            padding: 0 4px;
                            min-width: 18px;
                            text-align: center;
                        }
                    }
                }
            }

            .sale {
                position: absolute;
                top: 11px;
                left: 2px;
                background: rgba(0, 0, 0, 0.6);
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
                // width: 80px;
                padding: 0 1px;
                height: 34px;
                border-radius: 5px;
                line-height: 28px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .icon {
                    color: #ffd36c;
                    margin-right: 10px;
                    font-size: 12px;
                }

                span {
                    font-size: 12px;
                    color: #ffd36c;
                }
            }

            .mask {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                cursor: pointer;

                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
                box-shadow: 0px 2px 6px 0px rgba(53, 53, 53, 0.09);
            }
            .select-mask {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                cursor: pointer;
                border-radius: 4px;
                border: 4px solid;
                border-image: linear-gradient(270deg, rgba(255, 69, 29, 1), rgba(255, 202, 42, 1)) 8 8;
                .s-m-t {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 88px;
                    height: 31px;
                    font-size: 14px;
                    line-height: 31px;
                    text-align: center;
                    font-weight: 500;
                    color: #ffffff;
                    background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
                    border-radius: 0px 0px 0px 18px;
                }
            }
        }
    }

    .save-setting {
        width: 134px;
        height: 40px;
        background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
    }
}

@keyframes sliding-show {
    from {
        transform: translateX(500px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes sliding-hiden {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(500px);
    }
}
</style>
