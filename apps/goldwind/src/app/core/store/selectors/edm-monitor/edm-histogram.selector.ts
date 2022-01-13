import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { getEdmHistogramState } from '../../reducers';
import { EdmHistogramState } from '../../reducers/edm-monitor/edm-histogram.reducer';

export const getEdmHistogramResult = createSelector(
  getEdmHistogramState,
  (state: EdmHistogramState) => state?.result
);
export const getEdmHistogramChannel = createSelector(
  getEdmHistogramState,
  (state: EdmHistogramState) => state?.channel
);

export const getEdmHeatmapSeries = createSelector(
  getEdmHistogramResult,
  getEdmHistogramChannel,
  (result, channel): EChartsOption => {
    const channelData = result && channel && result[channel];
    if (!channelData || channelData.length <= 0) {
      return {};
    }
    // need: [time, y-class, value]
    const data: number[][] = [];

    const clazzes = Object.keys(channelData[0])?.filter((e) =>
      e.includes('clazz')
    );

    channelData.forEach((edmH) =>
      clazzes.forEach((clazz) => {
        data.push([edmH.timestamp, getIndexFromClazz(clazz), edmH[clazz]]);
      })
    );

    // eslint-disable-next-line unicorn/no-array-reduce
    const max = channelData.reduce(
      (acc, key) => Math.max(acc, ...clazzes.map((c) => key[c])),
      0
    );

    return {
      visualMap: {
        max,
      },
      xAxis: {
        type: 'category',
        data: channelData.map((edmH) => edmH.timestamp),
      },
      series: [
        {
          name: 'EDM Heatmap',
          type: 'heatmap',
          data,
        },
      ],
    };
  }
);

function getIndexFromClazz(clazz: string): number {
  return Number(clazz.replace('clazz', ''));
}
