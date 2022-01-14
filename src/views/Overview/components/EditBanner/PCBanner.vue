<template>
    <div class="swiper-box">
        <a-carousel autoplay class="swiper-pew">
            <img alt="" src="@assets/images/order-detail-img.jpg" />
            <img alt="" src="@assets/images/order-detail-img.jpg" />
            <img alt="" src="@assets/images/order-detail-img.jpg" />
        </a-carousel>
        <div class="swiper-link">
            <div class="link-detail">
                <h5>banner1链接</h5>
                <div class="link-detail-input">
                    <input type="text" />
                    <button>上传图片</button>
                </div>
            </div>
            <div class="link-detail">
                <h5>banner1链接</h5>
                <div class="link-detail-input">
                    <input class="txt-overflow" type="text" value="https://baidu.com" />
                    <button>上传图片</button>
                </div>
            </div>
            <div class="link-detail">
                <h5>banner1链接</h5>
                <div class="link-detail-input">
                    <input type="text" />
                    <button>上传图片</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.swiper-box {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    animation: slidingTBanner 0.4s linear 0s;

    .swiper-pew {
        width: 22vw;
        margin-right: 10px;
        border-radius: 4px;
        overflow: hidden;

        img {
            width: 22vw;
            height: 225px;
            object-fit: cover;
            object-position: 50% 50%;
        }
    }

    .swiper-link {
        flex: 1;

        .link-detail {
            text-align: left;
            margin-top: 12px;

            h5 {
                font-size: 14px;
                font-weight: 400;
                color: #0d0048;
            }

            .link-detail-input {
                margin-top: 5px;
                display: flex;

                input {
                    background: #f7f7f7;
                    border-radius: 6px;
                    flex: 1;
                    height: 34px;
                    font-size: 14px;
                    padding-left: 14px;
                    font-weight: 400;
                    color: #434343;
                }

                button {
                    width: 80px;
                    height: 34px;
                    background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
                    border-radius: 6px;
                    margin-left: 14px;
                    color: #ffffff;
                    font-weight: 500;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
