import { createSelector } from '@ngrx/store';
import { EChartsOption, SeriesOption } from 'echarts';

import { getEdmMonitorState } from '../../reducers';
import { EdmMonitorState } from '../../reducers/edm-monitor/edm-monitor.reducer';
import { Antenna, AntennaName, Edm } from '../../reducers/edm-monitor/models';
import { Interval } from '../../reducers/shared/models';

export const getEdmLoading = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): boolean => state.loading
);

export const getEdmResult = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): Edm[] => state.measurements
);

const edmGraphSeries = [
  {
    type: 'bar',
  },
  {
    name: (antennaName: AntennaName) => `${antennaName}Max`,
    type: 'line',
  },
];

export const getEdmGraphData = createSelector(
  getEdmResult,
  (edm: any, { sensorName }: Antenna): EChartsOption =>
    edm && {
      legend: {
        data: edmGraphSeries.map(({ name }) =>
          name ? name(sensorName) : sensorName
        ),
      },
      series: edmGraphSeries.map(({ name, type }) => {
        const seriesName = name ? name(sensorName) : sensorName;

        return {
          type,
          name: seriesName,
          data: edm.map((measurement: Edm) => ({
            value: [
              new Date(measurement.startDate),
              (measurement as any)[seriesName],
            ],
          })),
        } as SeriesOption;
      }),
    }
);

export const getEdmInterval = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): Interval => state.interval
);
