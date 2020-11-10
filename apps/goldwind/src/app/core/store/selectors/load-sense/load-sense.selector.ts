import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { getLoadSenseState } from '../../reducers';
import { LoadSenseState } from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense } from '../../reducers/load-sense/models';
import { GraphData, Interval } from '../../reducers/shared/models';

interface Timestamp {
  timestamp: string;
}
// Will at some point only return true if last result is not too old
export const getLiveStatus = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): boolean => state && false
);

export const getLoadSenseLoading = createSelector(
  getLoadSenseState,
  (state: LoadSenseState) => state.loading
);

export const getLoadSenseResult = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): LoadSense[] => state.result
);

export const getLoadInterval = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): Interval => state.interval
);

export const getLoadSenseMeasturementTimes = createSelector(
  getLoadSenseResult,
  (loadSenseResults: LoadSense[]): any =>
    loadSenseResults?.map(
      (loadSenseMeasurment: LoadSense) => loadSenseMeasurment.timestamp
    )
);

export const getLoadGraphData = createSelector(
  getLoadSenseResult,
  (loadSenseResults: LoadSense[], { timestamp }: Timestamp): GraphData => {
    const lspMeasurement =
      loadSenseResults &&
      (timestamp
        ? loadSenseResults.filter(
            (loadSense: LoadSense) => loadSense.timestamp === timestamp
          )[0]
        : loadSenseResults[loadSenseResults.length - 1]);

    const sensors =
      lspMeasurement &&
      Object.keys(lspMeasurement)
        .filter((key) => key.startsWith('lsp'))
        .map((entry) => entry.substring(3, 5));

    return (
      lspMeasurement &&
      sensors && {
        series: [
          {
            name: `${translate(
              `conditionMonitoring.centerLoad.bearingCenterLoad`
            ).toUpperCase()} ${translate(
              `conditionMonitoring.centerLoad.generator`
            ).toUpperCase()}`,
            type: 'line',
            coordinateSystem: 'polar',
            data: [
              ...sensors.map((number, index) => [
                (lspMeasurement as any)[`lsp${number}Strain`],
                (360 / sensors.length) * index,
              ]),
              ...[[lspMeasurement['lsp01Strain'], 0]], // required to make a complete circle
            ],
            areaStyle: {},
            smooth: true,
          },
        ],
      }
    );
  }
);
