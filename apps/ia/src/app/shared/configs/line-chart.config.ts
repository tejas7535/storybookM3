import { EChartsOption } from 'echarts';

import { Color } from '../models/color.enum';

export const LINE_CHART_BASE_OPTIONS: EChartsOption = {
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
  },
  color: [Color.GREEN, Color.BLUE],
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
