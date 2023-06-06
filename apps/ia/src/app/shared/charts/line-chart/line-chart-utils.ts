import { EChartsOption, LineSeriesOption } from 'echarts';

import { getPercentageValue } from '../../utils/utilities';
import { SMOOTH_LINE_SERIES_OPTIONS } from './line-chart.config';

export function createFluctuationRateChartConfig(
  unit: string = '',
  interval: number = 0.1
): EChartsOption {
  return {
    series: [],
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
  const data = ratesChartData
    ? ratesChartData.map((rate) => getPercentageValue(rate))
    : [];

  return {
    ...SMOOTH_LINE_SERIES_OPTIONS,
    id,
    name: data.length > 0 ? label : '',
    data,
  } as LineSeriesOption;
}
