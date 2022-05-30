<template>
    <a-modal :footer="null" :visible="postersVisible" class="modal" title="作品管理" width="45%">
        <div class="modal-body">
            <div class="item-qr-Code">
                <p>藏品二维码</p>
                <div ref="posters" class="item-qr-code-img">
                    <img :src="params.file" alt="" class="bg" />
                    <img alt="" class="decs-img" src="@/assets/images/posters.png" />
                    <img :src="qrCode" alt="" class="qr-code" />
                </div>
            </div>
            <div class="item-conversion-code">
                <div class="posters-btns">
                    <p>藏品兑换码</p>
                    <div class="excel-btn" @click="handleDownloadExcelClick">
                        <icon-svg icon="icon-xiazai"></icon-svg>
                        下载Excel兑换表
                    </div>
                    <div class="excel-btn" @click="handleDownloadPostersClick">
                        <icon-svg icon="icon-xiazai"></icon-svg>
                        下载海报
                    </div>
                </div>
            </div>
        </div>

        <template #closeIcon>
            <div class="close" @click="handleClose">取消</div>
        </template>
    </a-modal>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, watchEffect } from "vue";
import IconSvg from "@/components/IconSvg";
import { getAllPrivate, redeemCodeApi } from "@/api/api";
import { exportXlsx, generatorPosters, generatorQrCode } from "@/utils";

export default defineComponent({
    components: { IconSvg },
    props: {
        postersVisible: {
            type: Boolean,
        },
        params: {
            type: Object,
        },
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const qrCode = ref("");

        const handleClose = () => {
            emit("update:postersVisible");
        };
        const generatorQrCodeApi = async () => {
            const { err_code, result } = await redeemCodeApi(props.params.id);
            console.log(result);
            if (err_code !== "0") return;
            qrCode.value = await generatorQrCode(props.params.id);
        };
        watchEffect(() => {
            if (Object.keys(props.params).length > 0) {
                console.log(props.params);
                generatorQrCodeApi();
            }
        }, [props.params]);

        const handleDownloadExcelClick = async () => {
            const result = await getAllPrivate(props.params.id);
            if (result.err_code === "0") {
                const th = result.result.map((item, index) => [index + 1, item]);
                exportXlsx(["ID", "兑换码"], th, props.params.name);
            }
        };
        const handleDownloadPostersClick = () => {
            generatorPosters(proxy.$refs.posters);
        };
        return {
            qrCode,
            handleClose,
            handleDownloadExcelClick,
            handleDownloadPostersClick,
        };
    },
});
</script>

<style lang="scss" scoped>
.close {
    font-weight: 400;
    color: #bcbcbc;
    cursor: pointer;
}

.modal-body {
    display: flex;
    justify-content: space-between;

    .item-qr-Code {
        margin-right: 20px;
        width: 60%;

        p {
            font-size: 14px;
            font-weight: 500;
            color: #000000;
        }

        .item-qr-code-img {
            height: 370px;
            width: 100%;
            border-radius: 4px;
            overflow: hidden;
            position: relative;

            .bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                object-fit: cover;
                z-index: 1;
                object-position: center center;
            }

            .decs-img {
                position: absolute;
                width: 100%;
                bottom: 0px;
                right: 0px;
                z-index: 2;
            }

            .qr-code {
                width: 60px;
                height: 60px;
                position: absolute;
                right: 20px;
                bottom: 38px;
                z-index: 3;
            }
        }
    }

    .item-conversion-code {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .posters-btns {
            .excel-btn {
                width: 242px;
                height: 40px;
                background: #f6f6f6;
                border-radius: 12px;
                text-align: center;
                line-height: 40px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #000000;
                margin: 10px 0;
            }
        }
    }
}
</style>
