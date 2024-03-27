import { EChartsOption } from 'echarts';

import { Color } from '../../models/color.enum';

export const LINE_CHART_BASE_OPTIONS: EChartsOption = {
  textStyle: {
    fontFamily: 'Noto Sans',
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      show: true,
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
    minInterval: 1,
    axisPointer: {
      snap: true,
    },
  },
  color: [Color.DARK_GREY, Color.GREEN, Color.BLUE, Color.GOLDEN_ROD],
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
  smooth: false,
};

export const SMOOTH_LINE_SERIES_OPTIONS = {
  ...LINE_SERIES_BASE_OPTIONS,
  smooth: true,
};
