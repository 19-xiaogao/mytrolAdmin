import { watch, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import * as echarts from "echarts";
import { throttle } from "../../utils";

export default function useEcharts(props) {
  let vm;
  let echartsInstance;
  let chartEl;
  function initEChart(options) {
    if (echartsInstance) {
      return;
    }
    echartsInstance = echarts.init(chartEl);
    echartsInstance.setOption(options || {}, true);
  }
  const stopWatch = watch(
    () => props.options,
    (newOpt, oldOpt) => {
      if (!echartsInstance && newOpt) {
        initEChart(newOpt);
      } else {
        echartsInstance.setOption(newOpt, newOpt !== oldOpt);
      }
    }
  );

  // 监听 window resize
  const listenResize = throttle(() => {
    echartsInstance.setOption(props.options, false);
    echartsInstance.resize(); // 画布大小自适应 resize
  }, 200);

  onMounted(() => {
    vm = getCurrentInstance();
    chartEl = vm.proxy.$refs.echartsRef;
    initEChart(props.options);
    window.addEventListener("resize", listenResize);
  });
  onBeforeUnmount(() => {
    stopWatch();
    window.removeEventListener("resize", listenResize);
  });
  return {};
}
