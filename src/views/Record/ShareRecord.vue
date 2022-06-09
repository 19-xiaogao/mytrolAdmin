<template>
    <div class="share-record">
        <Order
            v-if="showOrderComponent"
            :id="currentNftParams.id"
            @showOrderDetailComponent="handleShowOrderDetailComponent"
        />
        <div class="ip-lists" v-show="!showOrderComponent">
            <div
                v-for="item in renderWorksList"
                :key="item.id"
                class="card"
                @mouseout="() => handleMouseover(false, item.id)"
                @mouseover="() => handleMouseover(true, item.id)"
            >
                <div :ref="String(item.id)" class="img">
                    <img :src="item.file" alt="" />
                </div>
                <a-switch
                    class="options-left"
                    v-model:checked="item.is_whitelisted"
                    @click="handleSetWhiteStatusClick(e, item.id, item.is_whitelisted)"
                    checked-children="开启白名单"
                    un-checked-children="关闭白名单"
                />
                <a-button class="lookDetail" @click="handleItemCardClick(item)">查看详情</a-button>
                <a-dropdown class="options">
                    <p>
                        <span class="text">设置</span>
                        <icon-svg class="icon" icon="icon-a-bianzu13"></icon-svg>
                    </p>
                    <template #overlay>
                        <a-menu>
                            <!-- v-if="item.publish == 2" -->
                            <a-menu-item @click="handleExportOrderClick(item.id, item.name)"
                                >导出订单数据
                            </a-menu-item>
                            <a-menu-item @click="handleNftTransferStatusClick(item.id, item.no_transfer)">
                                <span> {{ item.no_transfer === "false" ? "禁止转赠" : "开启转赠" }} </span>
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
                            <span class="txt-overflow" style="width: 100px">{{ item.nickname }}</span>
                        </div>
                    </div>
                    <div class="me-m">
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
        <a-pagination
            v-show="!showOrderComponent"
            class="pagination"
            @change="handlePaginationChange"
            v-model="pagination.current"
            :show-total="(total) => `一共 ${total} 条`"
            :total="pagination.total"
        />
        <OrderDetail v-if="isOrderShow" :orderItem="currentOrderItem" @close="handleOrderDetailClick" />

        <div class="current-title" v-if="showOrderComponent">
            <div class="title">
                <span class="t1">{{ currentNftParams.name }}</span>
                <span class="t2" @click="handleBlockClick">返回</span>
            </div>
            <a-popover title="设置分享" trigger="click">
                <template #content>
                    <div class="share-content">
                        <div class="share-time">
                            <span>分享到期时间</span>
                            <a-date-picker show-time v-model:value="shareTime" @change="handleSureClick" />
                        </div>
                        <div class="share-link">
                            <span class="t1">分享链接</span>
                            <div class="input">
                                <input type="text" :value="shareLink" ref="input" />
                                <icon-svg icon="icon-fuzhi" class="icon" @click="copyClick"></icon-svg>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="share">分享</div>
            </a-popover>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, onMounted, ref, reactive } from "vue";
import dayjs from "dayjs";
import {
    getSuccessOrderApi,
    GetAdminAllNftApi,
    setWhitelistStatusApi,
    getShareAccessToken,
    setNftTransferStatusApi,
} from "@api";
import { exportXlsx, warningNotify, successNotify } from "@/utils";
import Order from "./Order";
import OrderDetail from "./OrderDetail";
// publishStatusUnPublish = "0"; //下架
// publishStatusPublishing = "1" //审核
// publishStatusSuccess    = "2" //发布成功
// publishStatusFailed     = "3" //发布失败
export default defineComponent({
    components: {
        Order,
        OrderDetail,
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const renderWorksList = ref([]);
        const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

        const currentNftParams = ref({});
        const currentOrderItem = ref({});

        const isOrderShow = ref(false);

        const shareTime = ref("");
        const shareLink = ref("");

        const handleMouseover = (bol, id) => {
            bol
                ? (proxy.$refs[id][0].style.transform = "scale(1.2)")
                : (proxy.$refs[id][0].style.transform = "scale(1)");
        };

        // 是否显示设置元素
        const showOptionsElement = computed(() => (publish) => publish !== "1");

        const showOpenTime = computed(() => {
            return (item) =>
                item.publish === "2" && Date.parse(new Date()) / 1000 < Number(item.opening_time);
        });

        const showOrderComponent = computed(() => Object.keys(currentNftParams.value).length > 0);
        onMounted(() => {
            shareLink.value = `${window.origin}/share?`;
            getWorksList();
        });

        const handleShowOrderDetailComponent = (item) => {
            isOrderShow.value = true;
            currentOrderItem.value = item;
        };
        const handleOrderDetailClick = () => {
            isOrderShow.value = !isOrderShow.value;
        };

        const returnPrivateTableData = (result) => {
            if (!Array.isArray(result)) {
                return [];
            }
            const arr = result.map((item) => ({
                ...item,
                file: proxy.joinPreviewUrl(item.file),
                author_avatar: proxy.joinPreviewUrl(item.avatar),
            }));
            return arr;
        };
        const getWorksList = async () => {
            const { err_code, result } = await GetAdminAllNftApi(pagination.current, pagination.pageSize);
            if (err_code === "0") {
                renderWorksList.value = returnPrivateTableData(result.list);
                pagination.total = result.total;
            }
        };

        // 对导出数据做处理
        const handleExportDataFile = (result) => {
            if (!Array.isArray(result) && result.length < 0) return;
            result.forEach((item) => {
                delete item.avatar;
                delete item.created_at;
                delete item.description;
                delete item.nft_file;
            });
            return result.map((item) => Object.values(item));
        };

        // 处理订单导出数据
        const handleExportOrderClick = async (id, name) => {
            const { err_code, result } = await getSuccessOrderApi(id);
            console.log(result);
            if (err_code == "0" && result.length > 0) {
                const th = handleExportDataFile(result);
                const td = [
                    "价格",
                    "买家hash地址",
                    "NFT编号",
                    "NFT名称",
                    "剩余数量",
                    "NFT卖方名称",
                    "mytrol订单号",
                    "NFT卖方地址",
                    "NFT总数",
                    "交易hash",
                    "订单号",
                ];
                exportXlsx(td, th, name);
            } else {
                warningNotify("暂无数据");
            }
        };

        const handleItemCardClick = async (item) => {
            currentNftParams.value = item;
        };
        const handlePaginationChange = (page, pageSize) => {
            pagination.current = page;
            pagination.pageSize = pageSize;
            getWorksList();
        };
        const handleBlockClick = () => {
            currentNftParams.value = {};
            shareLink.value = `${window.origin}/share?`;
            shareTime.value = "";
        };

        const handleSureClick = async () => {
            const pastTime = dayjs(shareTime.value).unix();
            const item = currentNftParams.value;
            const accessTokenResult = await getShareAccessToken(pastTime, item.id);
            if (accessTokenResult.err_code === "0") {
                const { result } = accessTokenResult;
                shareLink.value = `${window.origin}/share?id=${item.id}&access_token=${result.access_token}`;
            }
        };
        const handleSetWhiteStatusClick = async (e, id, status) => {
            console.log(e);
            const result = await setWhitelistStatusApi({
                denom_id: String(id),
                status: String(status),
            });
            if (result.err_code === "0") {
                getWorksList();
            }
        };

        const handleNftTransferStatusClick = async (id, can_transfer) => {
            const status = can_transfer === "false";
            console.log(can_transfer);
            const result = await setNftTransferStatusApi({
                denom_id: String(id),
                status: String(status),
            });
            if (result.err_code == "0") {
                successNotify("设置成功");
                getWorksList();
            }
        };

        const copyClick = () => {
            proxy.$refs.input.select();
            document.execCommand("copy");
            successNotify("复制成功");
        };

        return {
            renderWorksList,
            showOptionsElement,
            pagination,
            showOpenTime,
            isOrderShow,
            currentOrderItem,
            handleMouseover,
            handleExportOrderClick,
            handleItemCardClick,
            handleSureClick,
            copyClick,
            dayjs,
            shareLink,
            shareTime,
            handlePaginationChange,
            handleOrderDetailClick,
            handleNftTransferStatusClick,
            currentNftParams,
            showOrderComponent,
            handleBlockClick,
            handleShowOrderDetailComponent,
            handleSetWhiteStatusClick,
        };
    },
});
</script>

<style scoped lang="scss">
.share-record {
    position: relative;
    height: 79vh;
}
.title-r {
    position: absolute;
    top: 0;
    right: 40px;
}
.share-content {
    width: 400px;
    .share-time {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
    }
    .share-link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .t1 {
            width: 100px;
        }
        .input {
            position: relative;
            flex: 1;
            background: #f7f7f7;
            height: 36px;
            padding: 0 10px;
            border-radius: 4px;
            input {
                width: 100%;
                height: 100%;
                padding-right: 20px;
            }
            .icon {
                font-size: 20px;
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
            }
        }
    }
}
.current-title {
    position: absolute;
    top: -40px;
    left: 210px;
    display: flex;
    justify-content: space-between;
    .title {
        background: #f2f2f2;
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        .t1 {
            font-size: 14px;
            font-weight: 500;
            color: #000000;
            line-height: 16px;
        }
        .t2 {
            width: 40px;
            height: 24px;
            background: #2f0088;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
            color: #ffffff;
            margin-left: 10px;
            cursor: pointer;
        }
    }

    .share {
        width: 96px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #2f0088;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        margin-left: 140px;
        background: #2f0088;
    }
}
.ip-lists {
    position: absolute;
    top: 50px;
    margin-top: 20px;
    overflow-y: auto;
    height: 85%;
    display: flex;
    flex-wrap: wrap;
    position: relative;

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
        .options-left {
            position: absolute;
            top: 20px;
            left: 2;
            z-index: 3;
        }
        .lookDetail {
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 4;
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
.pagination {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
