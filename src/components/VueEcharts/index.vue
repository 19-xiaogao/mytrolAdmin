<template>
    <div class="echarts" ref="echartsRef" />
</template>

<script>
import { defineComponent } from "vue";
import useEcharts from "./useEcharts";

export default defineComponent({
    name: "index",
    props: {
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        return { ...useEcharts(props) };
    },
});
</script>

<style lang="scss" scoped>
.echarts {
    width: 100%;
    height: 100%;
    padding: 10px;
}
</style>
