import { EChartsOption, LineSeriesOption } from 'echarts';
import moment from 'moment';

import { SMOOTH_LINE_SERIES_OPTIONS } from './line-chart.config';

export function getXAxisData(timeRange: string): string[] {
  const timeRangeEnd = moment.unix(+timeRange.split('|')[1]).utc();

  const fiveMonthsAgo = timeRangeEnd.clone().subtract(5, 'months');
  const fourMonthsAgo = timeRangeEnd.clone().subtract(4, 'months');
  const threeMonthsAgo = timeRangeEnd.clone().subtract(3, 'months');
  const twoMonthsAgo = timeRangeEnd.clone().subtract(2, 'months');
  const oneMonthAgo = timeRangeEnd.clone().subtract(1, 'months');
  const month = timeRangeEnd.clone();

  return [
    `${fiveMonthsAgo.format('M/YY')}`,
    `${fourMonthsAgo.format('M/YY')}`,
    `${threeMonthsAgo.format('M/YY')}`,
    `${twoMonthsAgo.format('M/YY')}`,
    `${oneMonthAgo.format('M/YY')}`,
    `${month.format('M/YY')}`,
  ];
}

export function createFluctuationRateChartConfig(
  unit: string = '',
  interval: number = 0.1,
  timeRange: string
): EChartsOption {
  return {
    series: [],
    xAxis: {
      data: getXAxisData(timeRange),
    },
    yAxis: {
      axisLabel: {
        formatter: `{value}${unit}`,
      },
      minInterval: interval,
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
      },
      formatter: (param: any) => `${param.data}${unit}`,
    },
    displayMode: 'multipleByCoordSys',
    grid: {
      left: 50,
    },
  };
}

export function createFluctuationRateChartSerie(
  id: string,
  label: string,
  ratesChartData: number[]
): LineSeriesOption {
  const data = ratesChartData ?? [];

  return {
    ...SMOOTH_LINE_SERIES_OPTIONS,
    id,
    name: data.length > 0 ? label : '',
    data,
  } as LineSeriesOption;
}
