import { DecimalPipe } from '@angular/common';

import { DataPoint } from './data-point.model';

const decimalPipe = new DecimalPipe('de-DE');

export const COLOR_PLATTE = [
  '#c9cdc8',
  '#979797',
  '#41a9bc',
  '#bfc3ca',
  '#adcf76',
  '#46b2a7',
  '#2f799e',
  '#8fb2ca',
  '#2b8172',
  '#787d78',
];

export const TOOLTIP_CONFIG = {
  trigger: 'item',
  axisPointer: {
    type: 'shadow',
  },
};

export const Y_AXIS_CONFIG = [
  {
    type: 'category',
    inverse: true,
    axisPointer: {
      type: 'shadow',
    },
  },
];

export const getXAxisConfig = (hasNegativeCostValues: boolean) => [
  {
    type: 'value',
    axisLine: { show: false },
    axisTick: {
      show: false,
    },
    axisLabel: {
      formatter: '{value} €',
      color: '#646464',
    },
  },
  {
    type: 'value',
    axisLabel: {
      formatter: '{value} %',
      color: '#646464',
    },
    axisLine: { show: false },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    min: hasNegativeCostValues ? -20 : 0,
    itemStyle: {
      color: 'red',
    },
  },
];

export const getChartSeries = (
  barChartData: DataPoint[],
  lineChartData: number[]
): any => [
  {
    type: 'bar',
    data: barChartData,
    barMaxWidth: 20,
    itemStyle: {
      borderRadius: 10,
    },
    tooltip: {
      formatter: barchartTooltipFormatter,
    },
  },
  {
    type: 'line',
    xAxisIndex: 1,
    data: lineChartData,
    tooltip: {
      formatter: linechartTooltipFormatter,
    },
  },
];

export const barchartTooltipFormatter = (params: {
  name: string;
  value: number;
  [key: string]: any;
}): string =>
  `${params.name}: ${decimalPipe.transform(params.value, '1.5-5')}€`;

export const linechartTooltipFormatter = (params: {
  value: number;
  [key: string]: any;
}): string => `${decimalPipe.transform(params.value, '1.0-2')}%`;
