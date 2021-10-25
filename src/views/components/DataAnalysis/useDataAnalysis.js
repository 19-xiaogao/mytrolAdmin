 export function createPieOption(data) {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    label: {
      show: true,
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "文章统计概览",
        type: "pie",
        radius: ["40%", "70%"],
        // roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };
}
