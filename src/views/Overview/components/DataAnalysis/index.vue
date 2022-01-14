<template>
    <div class="data-analysis">
        <div class="data">
            <h4>数据</h4>
            <div class="data-detail">
                <div class="title">
                    <!-- <h3>{{ statisticDatas.user_number }}</h3> -->
                    <h3>-</h3>
                    <span>用户注册量</span>
                </div>
                <div class="echart">
                    <v-chart :options="lineOption" />
                </div>
            </div>
            <div class="data-detail">
                <div class="title">
                    <!-- <h3>{{ statisticDatas.nft_number }}</h3> -->
                    <h3>-</h3>
                    <span>NFT创作量</span>
                </div>
                <div class="echart">
                    <v-chart :options="lineOption" />
                </div>
            </div>
            <div class="data-detail">
                <div class="title">
                    <h3>-</h3>
                    <span>已成交NFT量</span>
                </div>
                <div class="echart">
                    <v-chart :options="lineOption" />
                </div>
            </div>
        </div>
        <div class="analysis">
            <div class="title">
                <h4>成交金额</h4>
                <span>总成交：-CNY </span>
            </div>
            <v-chart :options="pieOption" />
        </div>
    </div>
</template>

<script>
import VueEcharts from "@/components/VueEcharts/index.vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { createLineOption, createPieOption } from "./useDataAnalysis";
// import { getTradeDataCountApi } from "@api";
export default defineComponent({
    components: {
        "v-chart": VueEcharts,
    },
    setup() {
        const statisticDatas = ref({ user_number: 0, nft_number: 0 });
        const pieOption = reactive(
            createPieOption([
                { value: 735, name: "总成交量" },
                { value: 1048, name: "昨日成交量" },
            ])
        );
        onMounted(() => {
            // getTradeDataCount();
        });

        // const getTradeDataCount = async () => {
        //   const { err_code, result } = await getTradeDataCountApi();
        //   if (err_code === "0") {
        //     statisticDatas.value = result;
        //   }
        // };
        const lineOption = reactive(createLineOption([10, 20, 5, 20]));
        return {
            pieOption,
            lineOption,
            statisticDatas,
        };
    },
});
</script>

<style lang="scss" scoped>
.data-analysis {
    margin-top: 14px;
    height: 54.85%;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
    border-radius: 8px;
    border: 0px solid rgba(213, 213, 213, 0.58);
    box-sizing: border-box;
    display: flex;
    padding: 20px 30px;

    .data {
        width: 24.88%;
        text-align: left;

        h4 {
            font-size: 20px;
            font-weight: 500;
            color: #000000;
        }

        .data-detail {
            width: 100%;
            height: 28%;
            border-radius: 8px;
            border: 1px solid #f1f1f1;
            box-sizing: border-box;
            padding: 22px 29px 26px 34px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .title {
                h3 {
                    font-size: 34px;
                    font-family: Roboto-Bold, Roboto;
                    font-weight: bold;
                    color: #000000;
                    margin: 0;
                    padding: 0;
                }

                span {
                    font-size: 14px;
                    text-align: center;
                }
            }

            .echart {
                width: 80px;
                height: 100px;
            }
        }
    }

    .analysis {
        flex: 1;
        text-align: left;
        padding-left: 20px;
        box-sizing: border-box;
        overflow: hidden;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            h4 {
                font-size: 20px;
                font-weight: 500;
                color: #000000;
            }

            span {
                font-size: 16px;
                font-weight: 500;
                color: #000000;
            }
        }
    }
}
</style>
