import { EChartOption } from 'echarts';

// echarts default configuration
export const chartOptions: EChartOption = {
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
