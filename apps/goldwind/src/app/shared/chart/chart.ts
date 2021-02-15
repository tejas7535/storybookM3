import { translate } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';

import { DATE_FORMAT } from '../constants';

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

const tooltipFormatter = (params: any): any => {
  if (params.seriesName === 'Rotor') {
    return `${params.seriesName}<br />
          Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[0].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[1].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[2].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[3].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[4].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 11:&nbsp;&nbsp;${params.data.value[5].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 13:&nbsp;&nbsp;${params.data.value[6].toLocaleString(
            DATE_FORMAT.local
          )}<br />
          Lsp 15:&nbsp;&nbsp;${params.data.value[7].toLocaleString(
            DATE_FORMAT.local
          )}<br />`;
  } else if (params.seriesName === 'Generator') {
    return `${params.seriesName}<br />
    Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[0].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[1].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[2].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;${params.data.value[3].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 10:&nbsp;&nbsp;${params.data.value[4].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 12:&nbsp;&nbsp;${params.data.value[5].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 14:&nbsp;&nbsp;${params.data.value[6].toLocaleString(
      DATE_FORMAT.local
    )}<br />
    Lsp 16:&nbsp;&nbsp;${params.data.value[7].toLocaleString(
      DATE_FORMAT.local
    )}<br />`;
  }
};

export const radarChartOptions: EChartsOption = {
  ...chartOptions,
  legend: {
    data: [
      translate('conditionMonitoring.centerLoad.generator'),
      translate('conditionMonitoring.centerLoad.rotor'),
    ],
  },
  tooltip: {
    trigger: 'item',
    formatter: tooltipFormatter,
  },
  radar: [
    {
      indicator: [
        { text: '0°', max: 3000 },
        { text: '45°', max: 3000 },
        { text: '90°', max: 3000 },
        { text: '135°', max: 3000 },
        { text: '180°', max: 3000 },
        { text: '225°', max: 3000 },
        { text: '270°', max: 3000 },
        { text: '315°', max: 3000 },
      ],
      startAngle: 0,
      shape: 'circle',
    },
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
