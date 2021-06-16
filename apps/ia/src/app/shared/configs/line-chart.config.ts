import { EChartsOption } from 'echarts';

export const LINE_CHART_BASE_OPTIONS: EChartsOption = {
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
  },
  color: ['#6E9B34', '#1D9BB2', '#c9cdc8'],
  backgroundColor: 'white',
  legend: {
    show: true,
    left: 'center',
    top: 'bottom',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
};

export const LINE_SERIES_BASE_OPTIONS = {
  showSymbol: false,
  lineStyle: {
    width: 4,
  },
  type: 'line',
};

export const SMOOTH_LINE_SERIES_OPTIONS = {
  ...LINE_SERIES_BASE_OPTIONS,
  smooth: true,
};
