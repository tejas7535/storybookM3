import { EChartsOption } from 'echarts';

export const CHART_BASE_OPTIONS: EChartsOption = {
  xAxis: {
    type: 'category',
    data: [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ],
  },
  yAxis: {
    type: 'value',
  },
  color: ['#6E9B34', '#1D9BB2', '#c9cdc8'],
  backgroundColor: 'white',
  legend: {
    show: true,
    left: 'center',
    top: 'bottom',
  },
};

export const SERIES_BASE_OPTIONS = {
  showSymbol: false,
  lineStyle: {
    width: 4,
  },
  type: 'line',
};
