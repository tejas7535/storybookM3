import { EChartsOption } from 'echarts';

export enum GaugeColors {
  GREEN = '#0ebc5b',
  YELLOW = '#fccf46',
  RED = '#e62c27',
}

// echarts default configuration
export const chartOptions: EChartsOption = {
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

export const axisChartOptions: EChartsOption = {
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
      filterMode: 'filter',
      type: 'inside',
    },
    {}, // for slider zoom
  ],
};

export const polarChartOptions: EChartsOption = {
  ...chartOptions,
  legend: {},
  tooltip: {
    trigger: 'axis',
  },
  polar: {},
  angleAxis: {
    type: 'value',
    max: 360,
    clockwise: false,
    interval: 22.5,
    splitLine: {
      show: true,
    },
  },
  radiusAxis: {
    type: 'value',
    max: 8000,
  },
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
        [0.75, GaugeColors.GREEN],
        [0.85, GaugeColors.YELLOW],
        [1, GaugeColors.RED],
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
