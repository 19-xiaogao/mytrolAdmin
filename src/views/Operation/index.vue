<template>
    <div class="page-height">
        <CreateActivityModal v-model:createVisible="createActivityVisible" @ok="handleAddIpClick" />
        <IPDetail v-model:visible="currentIpMessage.visible" :params="currentIpMessage.params" />
        <div v-if="!currentIpMessage.visible">
            <div class="header">
                <h4>运营</h4>
                <div class="button" @click="handleCreateActivityClick">创建IP主题</div>
            </div>
            <div class="card-list">
                <div v-for="item in seriessList" :key="item.id" class="card-box">
                    <div class="card">
                        <div class="header">
                            <p>{{ item.name }}</p>
                            <span :class="isShowStatus(item.status) ? 'off-span' : ''">{{
                                isShowStatus(item.status) ? "未运营" : "运营中"
                            }}</span>
                        </div>
                        <div class="img" @click="hanleCardClick(item)">
                            <img :src="item.file" alt="" />
                        </div>
                        <div class="footer">
                            <div class="icons">
                                <a-tooltip>
                                    <template #title>删除</template>
                                    <icon-svg
                                        class="icon"
                                        icon="icon-remove"
                                        @click="handleRemoveClick(item.id)"
                                    ></icon-svg>
                                </a-tooltip>
                                <a-tooltip>
                                    <template #title
                                        >{{ isShowStatus(item.status) ? "上架" : "下架" }}
                                    </template>
                                    <icon-svg
                                        icon="icon-yiyouzhujici"
                                        @click="handleStatusClick(item)"
                                    ></icon-svg>
                                </a-tooltip>
                            </div>
                            <a-dropdown class="serial-number">
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item
                                            v-for="(k, index) in seriessList"
                                            :key="index"
                                            @click="handleDropdownIdClick(index + 1, item)"
                                        >
                                            序号{{ index + 1 }}
                                        </a-menu-item>
                                        <a-menu-item @click="handleDropdownIdClick('', item)">
                                            待定
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button>
                                    <span>{{
                                        isShowStatus(item.status)
                                            ? "未运营"
                                            : !item.number
                                            ? "选择序号"
                                            : "序号" + item.number
                                    }}</span>
                                    <icon-svg class="icon" icon="icon-a-bianzu13"></icon-svg>
                                </a-button>
                            </a-dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import { addUpdateIpApi, getSeriesApi, remoteIpApi } from "@api";
import IPDetail from "./IPDetail";
import CreateActivityModal from "./CreateActivityModal";
import { joinPreviewUrl, sortOperation, successNotify, warningNotify } from "@/utils";
import { Modal } from "ant-design-vue";

export default {
    components: {
        IPDetail,
        CreateActivityModal,
    },
    setup() {
        const createActivityVisible = ref(false);
        const seriessList = ref([]);
        const currentIpMessage = reactive({
            visible: false,
            params: {},
        });
        const isShowStatus = computed(() => {
            return (status) => status === "off";
        });
        onMounted(() => {
            getSeriessListApi();
        });
        const assignmentFunc = (result) => {
            const joinIpfsList = result
                .map((item) => ({
                    ...item,
                    file: joinPreviewUrl(item.file),
                }))
                .reverse();
            seriessList.value = sortOperation(joinIpfsList);
        };
        const getSeriessListApi = async () => {
            const { err_code, result } = await getSeriesApi();
            if (err_code === "0") {
                if (!Array.isArray(result)) return;
                assignmentFunc(result);
            }
        };

        const handleAddIpClick = () => {
            setTimeout(() => {
                successNotify("创建IP成功。");
                getSeriessListApi();
            }, 1000);
        };

        const handleStatusClick = async (item) => {
            const status = item.status === "off" ? "on" : "off";
            let paramsObj = {
                name: item.name,
                status: status,
                number: String(item.number),
                operate: "update",
            };
            if (status === "off") {
                Modal.confirm({
                    title: "提示",
                    content: "下架后所有作品将不复存在,需要重新上传。",
                    maskClosable: false,
                    okText: "确定",
                    onOk() {
                        uploadStatus(item, paramsObj);
                    },
                });
            } else {
                uploadStatus(item, paramsObj);
            }
        };

        const uploadStatus = async (item, paramsObj) => {
            const { err_code } = await funcAddupdateIpApi(paramsObj);
            if (err_code === "0") {
                setTimeout(() => {
                    successNotify("更新IP成功。");
                    getSeriessListApi();
                }, 1000);
            }
        };

        const handleRemoveClick = (id) => {
            Modal.confirm({
                title: "提示",
                content: "确定删除吗？",
                maskClosable: false,
                okText: "确定",
                onOk() {
                    remoteIpApi({
                        ip_id: String(id),
                    }).then((res) => {
                        if (res.err_code === "0") {
                            getSeriessListApi();
                            successNotify("删除成功。");
                        }
                    });
                },
            });
        };

        const funcAddupdateIpApi = (obj) => {
            const formData = new FormData();
            for (let key in obj) {
                formData.append(key, obj[key]);
            }
            return addUpdateIpApi(formData);
        };
        const hanleCardClick = (item) => {
            currentIpMessage.visible = true;
            currentIpMessage.params = item;
        };
        const handleCreateActivityClick = () => {
            createActivityVisible.value = true;
        };

        const handleDropdownIdClick = async (key, item) => {
            if (item.status === "off") {
                return warningNotify("请先将IP上架");
            }

            const isFindKey = seriessList.value
                .filter((item) => item.status === "on")
                .find((item) => item.number == key);

            if (isFindKey) {
                return warningNotify("序列号已被占用。");
            }

            const { err_code } = await funcAddupdateIpApi({
                name: item.name,
                status: item.status,
                number: String(key),
                operate: "update",
            });
            if (err_code === "0") {
                getSeriessListApi();
                successNotify("更新序号成功。");
            }
        };
        return {
            handleCreateActivityClick,
            createActivityVisible,
            seriessList,
            isShowStatus,
            handleStatusClick,
            hanleCardClick,
            currentIpMessage,
            handleDropdownIdClick,
            handleRemoveClick,
            handleAddIpClick,
        };
    },
};
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: #000000;
        font-size: 20px;
    }

    .button {
        width: 117px;
        height: 40px;
        background: #2f0088;
        border-radius: 8px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        outline: none;
        white-space: nowrap;
        color: #ffffff;
        font-size: 14px;
    }
}

.card-list {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 75vh;
    .card-box {
        margin-right: 26px;
        margin-top: 10px;

        .card {
            width: 260px;
            height: 248px;
            background: #ffffff;

            &:hover {
                box-shadow: 0px 0px 12px 0px rgba(106, 106, 106, 0.2);
            }

            border-radius: 13px;
            border: 1px solid #e3e3e3;
            padding: 18px 18px 14px 18px;
            text-align: center;
            box-sizing: border-box;

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #000000;

                p {
                    margin: 0;
                    padding: 0;
                    font-size: 16px;
                    font-weight: 500;
                }

                .off-span {
                    &::before {
                        background: red !important;
                    }
                }

                span {
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

            .img {
                width: 224px;
                height: 142px;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 50% 50%;
                }
            }

            .footer {
                margin-top: 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .icons {
                    font-size: 1.2rem;
                    cursor: pointer;
                    font-weight: 600;

                    .icon {
                        margin-right: 4px;
                        font-weight: 600;
                    }
                }

                .serial-number {
                    width: 87px;
                    height: 34px;
                    border-radius: 6px;
                    border: 1px solid #cacaca;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding: 10px;
                    cursor: pointer;

                    .icon {
                        font-size: 1rem;
                    }

                    span {
                        font-size: 14px;
                        color: #000;
                        font-weight: 400;
                    }
                }
            }
        }
    }
}
</style>
