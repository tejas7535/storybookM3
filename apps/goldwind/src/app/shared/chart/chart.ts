import { EChartOption } from 'echarts';

// echarts default configuration
export const chartOptions: EChartOption = {
  legend: {
    selectedMode: false,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#ced5da',
    borderWidth: 1,
    textStyle: { color: '#646464' },
    padding: 10,
  },
  color: [
    '#73a195',
    '#c0c6bf',
    '#878787',
    '#1d9bb2',
    '#b6bac2',
    '#a1c861',
    '#43635b',
    '#707b6e',
  ],
};

export const axisChartOptions: EChartOption = {
  ...chartOptions,
  xAxis: {
    type: 'time',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
  },
  dataZoom: [
    {
      type: 'inside',
    },
    {}, // for slider zoom
  ],
};

export const GREASE_GAUGE_SERIES = {
  type: 'gauge',
  splitNumber: 4,
  title: {
    show: true,
    fontWeight: 'bolder',
    fontSize: 14,
    offsetCenter: [0, '110%'],
  },
  detail: {
    color: '#646464',
    fontSize: 18,
    fontWeight: 'bolder',
  },
  pointer: {
    // show: false, // screendesign does hide it
  },
  axisLine: {
    lineStyle: {
      width: 12,
      color: [
        [0.75, '#0ebc5b'], // green
        [0.85, '#fccf46'], // yellow
        [1, '#e62c27'], // red
      ],
    },
  },
  splitLine: {
    show: false,
    length: 20,
  },
  axisTick: {
    show: false, // only show outside
  },
  axisLabel: {
    // position outside would be awesome
    distance: 0,
  },
};
