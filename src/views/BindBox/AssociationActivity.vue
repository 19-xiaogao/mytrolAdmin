<template>
    <div ref="conversionRef" class="operation-activity">
        <div class="header">
            <span class="title">添加盲盒NFT关联</span>
            <icon-svg class="icon" icon="icon-a-bianzu101" @click="handleHideClick"></icon-svg>
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
                        <div class="_limit">
                            <div class="_t1">数量</div>
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
            保存设置
        </a-button>
    </div>
</template>

<script>
import { onMounted, onUpdated, ref, getCurrentInstance } from "vue";
import { getBindBoxNftApi } from "@/api/api.js";
export default {
    emits: ["close"],

    props: {
        nftNumber: [Number, String],
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        const conversionRef = ref(null);
        const loading = ref(false);
        const worksList = ref([]);
        const handleHideClick = () => {
            conversionRef.value.style.animation = "sliding-hiden 0.5s linear 0s";
            setTimeout(() => {
                emit("close");
            }, 400);
        };

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
        };

        const getWorksList = async () => {
            const { err_code, result } = await getBindBoxNftApi();
            if (err_code === "0") {
                worksList.value = returnPrivateTableData(result.list);
            }
        };

        const handleSaveSettingClick = () => {
            const selectIds = worksList.value.filter((v) => v.selected).map((m) => m.id);
            emit("close", selectIds);
        };
        const handleSelectedClick = (index) => {
            worksList.value[index].selected = !worksList.value[index].selected;
        };

        return {
            handleHideClick,
            conversionRef,
            loading,
            worksList,
            handleSaveSettingClick,
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

    .nft-list {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        height: 88%;
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
