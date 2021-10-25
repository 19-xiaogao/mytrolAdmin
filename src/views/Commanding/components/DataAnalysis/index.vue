<template>
  <div class="data-analysis">
    <div class="data">
      <h4>数据</h4>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="analysis">
      <div class="title">
        <h4>成交金额</h4>
        <span>总成交：319141212CNY </span>
      </div>
      <v-chart :options="pieOption" />
    </div>
  </div>
</template>

<script>
import VueEcharts from "@/components/VueEcharts/index.vue";
import { defineComponent, reactive } from "vue";
import { createPieOption } from "./useDataAnalysis";
export default defineComponent({
  components: {
    "v-chart": VueEcharts,
  },
  setup() {
    const pieOption = reactive(createPieOption());
    return {
      pieOption,
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
    width: 22.88%;
    text-align: left;
    h4 {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
    }
  }
  .analysis {
    flex: 1;
    text-align: left;
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
