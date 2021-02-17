import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GaugeColors } from '../../../../shared/chart/chart';
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

const rotorSideValues = (lsp: LoadSense): number[] =>
  lsp && [
    lsp.lsp01Strain,
    lsp.lsp03Strain,
    lsp.lsp05Strain,
    lsp.lsp07Strain,
    lsp.lsp09Strain,
    lsp.lsp11Strain,
    lsp.lsp13Strain,
    lsp.lsp15Strain,
  ];

const generatorSideValues = (lsp: LoadSense): number[] =>
  lsp && [
    lsp.lsp02Strain,
    lsp.lsp04Strain,
    lsp.lsp06Strain,
    lsp.lsp08Strain,
    lsp.lsp10Strain,
    lsp.lsp12Strain,
    lsp.lsp14Strain,
    lsp.lsp16Strain,
  ];

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

    return (
      lspMeasurement && {
        series: [
          {
            name: `${translate(`conditionMonitoring.centerLoad.generator`)}`,
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: generatorSideValues(lspMeasurement),
              },
            ],
            areaStyle: {
              opacity: 0.01,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: `${translate(`conditionMonitoring.centerLoad.rotor`)}`,
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: rotorSideValues(lspMeasurement),
              },
            ],
            areaStyle: {
              opacity: 0.01,
            },
            itemStyle: {
              color: GaugeColors.YELLOW,
            },
          },
        ],
      }
    );
  }
);
