export function createPieOption(data) {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },

    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "成交金额",
        type: "pie",
        radius: ["40%", "70%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        symbol: "none",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
}

export function createLineOption(data) {
  return {
    xAxis: [
      {
        type: "category",
        show: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        show: false,
      },
    ],
    series: [
      {
        symbol: "none",
        type: "line",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#003891", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#ECEEF4", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        smooth: true,
        data,
      },
    ],
  };
}
