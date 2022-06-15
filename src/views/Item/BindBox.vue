<template>
    <div class="bind-box-nft">
        <div class="ip-lists">
            <div
                v-for="item in renderWorksList"
                :key="item.id"
                class="card"
                @click="handleItemCardClick(item)"
                @mouseout="() => handleMouseover(false, item.id)"
                @mouseover="() => handleMouseover(true, item.id)"
            >
                <div :ref="String(item.id)" class="img">
                    <img :src="item.file" alt="" />
                </div>
                <a-dropdown class="options">
                    <p>
                        <span class="text">设置</span>
                        <icon-svg class="icon" icon="icon-a-bianzu13"></icon-svg>
                    </p>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="handleNftTransferStatusClick(item.id, item.can_transfer)">
                                <span> {{ item.can_transfer ? "关闭转赠" : "开启转赠" }} </span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

                <div v-if="showOpenTime(item)" class="sale">
                    <icon-svg class="icon" icon="icon-naozhong"></icon-svg>
                    <span> {{ dayjs(item.opening_time * 1000).format("YYYY-MM-DD HH:mm") }}</span>
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
                        <div v-if="showPrice(item.publish)" class="manay">
                            {{ showFreePrice(item.free, item.price) }}
                        </div>

                        <div class="_limit">
                            <div class="_t1">限量</div>
                            <div class="_t2">{{ item.number }}</div>
                        </div>
                    </div>
                </div>
                <div class="mask"></div>
            </div>
            <p v-if="renderWorksList.length <= 0" class="no-found">暂无作品</p>
        </div>
    </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { shelvesNftApi, setNftTransferStatusApi, getBindBoxNftApi } from "@api";
import { successNotify } from "@/utils";
export default {
    setup() {
        const { proxy } = getCurrentInstance();
        const renderWorksList = ref([]);
        const shelvesObject = reactive({
            id: "",
            publish: "",
        });
        const shelvesVisible = ref(false);
        const currentIndex = ref(0);
        const postersParams = reactive({ postersVisible: false, params: "" });
        const addWhiteVisible = ref(false);

        const handleMouseover = (bol, id) => {
            bol
                ? (proxy.$refs[id][0].style.transform = "scale(1.2)")
                : (proxy.$refs[id][0].style.transform = "scale(1)");
        };

        const showSwitchShelves = computed(() => (publish) => {
            if (publish === "0") return "上架";
            if (publish === "2") return "下架";
        });

        // 是否显示设置元素
        const showOptionsElement = computed(() => (publish) => publish !== "1");

        //是否免费
        const showFreePrice = computed(() => (free, price) => free === "true" ? "免费" : "$" + price);

        //是否显示价格
        const showPrice = computed(() => (publish) => publish !== "0");

        //是否显示二维码
        const showQrCode = computed(() => (free, publish) => free === "true" && publish !== "0");

        const showOpenTime = computed(() => {
            return (item) =>
                item.publish === "2" && Date.parse(new Date()) / 1000 < Number(item.opening_time);
        });

        onMounted(() => {
            getWorksList();
        });

        const getWorksList = async () => {
            const { err_code, result } = await getBindBoxNftApi();
            console.log(result);
            if (err_code === "0") {
                renderWorksList.value = result.list.map((item) => ({
                    ...item,
                    file: proxy.joinPreviewUrl(item.file),
                    author_avatar: proxy.joinPreviewUrl(item.author_avatar),
                }));
            }
        };

        const handleAddWhiteListClick = (id, publish) => {
            shelvesObject.id = id;
            shelvesObject.publish = publish;
            addWhiteVisible.value = true;
        };

        const handleItemCardClick = (item) => {
            if (!currentIndex.value) return;

            postersParams.postersVisible = true;
            postersParams.params = item;
        };

        const handleTitleClick = (index) => {
            currentIndex.value = index;
            getWorksList();
        };

        const handleNftTransferStatusClick = async (id, can_transfer) => {
            const result = await setNftTransferStatusApi({
                denom_id: String(id),
                status: String(can_transfer),
            });
            if (result.err_code == "0") {
                successNotify("设置成功");
                getWorksList();
            }
        };

        // 处理下架
        const handleUnShelvesNft = async (id) => {
            const { err_code } = await shelvesNftApi(id);
            if (err_code === "0") {
                getWorksList();
                successNotify("操作成功。");
            }
        };

        const handleCloseClick = () => {
            getWorksList();
        };

        const handleShelvesClick = (id, publish) => {
            console.log(publish);
            if (publish === "2") {
                handleUnShelvesNft(id, publish);
            }
            if (publish === "0") {
                shelvesVisible.value = true;
                shelvesObject.id = id;
                shelvesObject.publish = publish;
            }
        };

        const handelShelvesEmit = () => {
            shelvesVisible.value = false;
            setTimeout(() => {
                getWorksList();
            }, 1000);
        };

        const handleCancelEmit = () => {
            shelvesVisible.value = false;
        };

        return {
            currentIndex,
            postersParams,
            renderWorksList,
            showSwitchShelves,
            showOptionsElement,
            showFreePrice,
            showPrice,
            showQrCode,
            shelvesObject,
            showOpenTime,
            shelvesVisible,
            addWhiteVisible,
            handelShelvesEmit,
            handleCancelEmit,
            handleShelvesClick,
            handleMouseover,
            handleTitleClick,
            handleItemCardClick,
            handleNftTransferStatusClick,
            handleAddWhiteListClick,
            handleCloseClick,
            dayjs,
        };
    },
};
</script>

<style lang="scss" scoped>
.bind-box-nft {
    height: 80vh;
    overflow-y: auto;
}
.ip-lists {
    margin-top: 20px;
    overflow-y: auto;
    height: 90%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    // justify-content: space-around;
    align-content: flex-start;

    .no-found {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
    }

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

                // .text {
                //   span:first-child {
                //     background: #ffbd21;
                //     border-radius: 4px;
                //     font-size: 8px;
                //     color: #000;
                //     border-radius: 4px;
                //     display: inline-block;
                //     padding: 2px;
                //   }
                //   span:last-child {
                //     display: inline-block;
                //     box-sizing: border-box;
                //     border: #ffbd21 1px solid;
                //     border-left-color: transparent;
                //     border-radius: 4px;
                //     color: #fff;
                //     padding: 2px;

                //     font-size: 8px;
                //   }
                // }
            }
        }

        .sale {
            position: absolute;
            top: 11px;
            left: 2px;
            background: rgba(0, 0, 0, 0.6);
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
            // width: 80px;
            padding: 0 5px;
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
    }
}
</style>