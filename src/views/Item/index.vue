<template>
    <div class="ip-detail page-height">
        <div class="ip-detail-title">
            <div class="title-l">
                <div :class="showPrivateClass(0)" @click="handleTitleClick(0)">作品</div>
                <div :class="showPrivateClass(1)" @click="handleTitleClick(1)">私人发售</div>
            </div>
            <div class="title-r">
                <TabBar v-model:currentIndex="currentMenu" :menuList="menuList" />
            </div>
        </div>
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
                <a-dropdown v-if="showOptionsElement(item.publish)" class="options">
                    <p>
                        <span class="text">设置</span>
                        <icon-svg class="icon" icon="icon-a-bianzu13"></icon-svg>
                    </p>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="handleShelvesClick(item.id, item.publish)">
                                <span>{{ showSwitchShelves(item.publish) }}</span>
                            </a-menu-item>
                            <a-menu-item
                                v-if="showQrCode(item.free, item.publish)"
                                @click="handleQrCodeClick(item.id)"
                            >
                                <span>小程序二维码</span>
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
        <ShelvesNft
            v-model:shelvesVisible="shelvesVisible"
            :params="shelvesObject"
            @cancel="handleCancelEmit"
            @shelves="handelShelvesEmit"
        />
        <PrivatePosters
            v-model:postersVisible="postersParams.postersVisible"
            :params="postersParams.params"
        />
    </div>
</template>

<script>
import {
    computed,
    createVNode,
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    watchEffect,
} from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import { Modal } from "ant-design-vue";
import { getWorksApi, redeemCodeApi, shelvesNftApi } from "@api";
import { generatorQrCode, successNotify } from "@/utils";
import PrivatePosters from "@/views/Item/PrivatePosters";
import TabBar from "@/components/TabBar";
import ShelvesNft from "./ShelvesNft";

// publishStatusUnPublish = "0"; //下架
// publishStatusPublishing = "1" //审核
// publishStatusSuccess    = "2" //发布成功
// publishStatusFailed     = "3" //发布失败
const menus = [
    {
        text: "已上架",
        type: "2",
    },
    {
        text: "审核中",
        type: "1",
    },
    {
        text: "已下架",
        type: "0",
    },
];
export default defineComponent({
    components: {
        TabBar,
        ShelvesNft,
        PrivatePosters,
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const currentMenu = ref("2");
        const menuList = reactive(menus);
        const worksList = ref([]);
        const renderWorksList = ref([]);
        const store = useStore();
        const shelvesObject = reactive({
            id: "",
            publish: "",
        });
        const shelvesVisible = ref(false);
        const currentIndex = ref(0);
        const postersParams = reactive({ postersVisible: false, params: "" });
        const handleMouseover = (bol, id) => {
            bol
                ? (proxy.$refs[id][0].style.transform = "scale(1.2)")
                : (proxy.$refs[id][0].style.transform = "scale(1)");
        };
        const user = computed(() => store.getters.getUser);

        const showSwitchShelves = computed(() => (publish) => {
            if (publish === "0") return "上架";
            if (publish === "2") return "下架";
        });

        //是否属于私人发售

        const showPrivateClass = computed(() => {
            return (index) => (currentIndex.value === index ? "char cover" : "char");
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

        // watchEffect listen table switch change event
        watchEffect(() => {
            renderWorksList.value = worksList.value
                .filter((item) => item.publish === currentMenu.value)
                .map((item) => ({
                    ...item,
                    file: proxy.joinPreviewUrl(item.file),
                    author_avatar: proxy.joinPreviewUrl(item.author_avatar),
                }));
        }, [currentMenu, worksList]);

        onMounted(() => {
            getWorksList();
        });

        const returnPrivateTableData = (result) => {
            return result.filter((item) => item.free === String(!!currentIndex.value));
        };
        const getWorksList = async () => {
            const { err_code, result } = await getWorksApi(user.value.user_id);
            if (err_code === "0") {
                worksList.value = returnPrivateTableData(result);
            }
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

        // 处理下架
        const handleUnShelvesNft = async (id) => {
            const { err_code } = await shelvesNftApi(id);
            if (err_code === "0") {
                getWorksList();
                successNotify("操作成功。");
            }
        };

        const handleShelvesClick = (id, publish) => {
            if (publish === "2") {
                handleUnShelvesNft(id, publish);
            }
            if (publish === "0") {
                shelvesVisible.value = true;
                shelvesObject.id = id;
                shelvesObject.publish = publish;
            }
        };
        const handleQrCodeClick = async (id) => {
            const { err_code, result } = await redeemCodeApi(id);
            if (err_code === "0") {
                const qrCode = await generatorQrCode(id, result);
                Modal.success({
                    title: "二维码生成成功",
                    content: createVNode("img", {
                        src: qrCode,
                        style: "width:100%;height:100%;margin-left:-19px;",
                    }),
                });
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
            currentMenu,
            menuList,
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
            showPrivateClass,
            shelvesVisible,
            handelShelvesEmit,
            handleCancelEmit,
            handleShelvesClick,
            handleQrCodeClick,
            handleMouseover,
            handleTitleClick,
            handleItemCardClick,
            dayjs,
        };
    },
});
</script>

<style lang="scss" scoped>
.ip-detail {
    // overflow: hidden;
    .ip-detail-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title-l {
            display: flex;
            align-items: center;
            justify-content: center;

            .icon {
                width: 10px;
                height: 10px;
                border-radius: 1px;
                border: 2px solid #222222;
                border-right-color: transparent;
                border-top-color: transparent;
                transform: rotate(40deg);
                cursor: pointer;
            }

            .char {
                font-size: 16px;
                font-weight: 500;
                color: #000000;
                margin: 0 17px;
                cursor: pointer;
            }

            .cover {
                font-size: 20px;
                border-bottom: 2px solid rgb(237, 102, 55);
            }

            .status {
                font-size: 14px;
                font-weight: 400;
                display: inline-block;
                position: relative;

                &::before {
                    position: relative;
                    top: 50%;
                    left: -6px;
                    content: "";
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #2caf71;
                    border-radius: 50%;
                }
            }
        }
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
}
</style>
