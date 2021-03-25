import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GaugeColors } from '../../../../shared/chart/chart';
import { DATE_FORMAT } from '../../../../shared/constants';
import { getBearingLoadState } from '../../reducers';
import { BearingLoadLatestState } from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense, LoadSenseAvg } from '../../reducers/load-sense/models';
import { GraphData } from '../../reducers/shared/models';

// Will at some point only return true if last result is not too old
export const getLoadSenseLoading = createSelector(
  getBearingLoadState,
  (state: BearingLoadLatestState) => state.loading
);

export const getLoadAverageLoading = createSelector(
  getBearingLoadState,
  (state: BearingLoadLatestState) => state.averageResult.loading
);

export const getBearingLoadLatestResult = createSelector(
  getBearingLoadState,
  (state: BearingLoadLatestState): LoadSense => state.result
);

export const getLoadAverageResult = createSelector(
  getBearingLoadState,
  (state: BearingLoadLatestState): LoadSenseAvg => state.averageResult.result
);

export const getBearingLoadLatestTimeStamp = createSelector(
  getBearingLoadLatestResult,
  (loadSense: LoadSense) =>
    loadSense &&
    new Date(loadSense.timestamp).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
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

const rotorSideAvgValues = (lsp: LoadSenseAvg): number[] =>
  lsp && [
    lsp.lsp01StrainAvg,
    lsp.lsp03StrainAvg,
    lsp.lsp05StrainAvg,
    lsp.lsp07StrainAvg,
    lsp.lsp09StrainAvg,
    lsp.lsp11StrainAvg,
    lsp.lsp13StrainAvg,
    lsp.lsp15StrainAvg,
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

const generatorSideAvgValues = (lsp: LoadSenseAvg): number[] =>
  lsp && [
    lsp.lsp02StrainAvg,
    lsp.lsp04StrainAvg,
    lsp.lsp06StrainAvg,
    lsp.lsp08StrainAvg,
    lsp.lsp10StrainAvg,
    lsp.lsp12StrainAvg,
    lsp.lsp14StrainAvg,
    lsp.lsp16StrainAvg,
  ];
export const getLoadGraphData = createSelector(
  getBearingLoadLatestResult,
  (loadSenseResult: LoadSense): GraphData => {
    return (
      loadSenseResult && {
        series: [
          {
            name: `${translate(`conditionMonitoring.centerLoad.generator`)}`,
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: generatorSideValues(loadSenseResult),
                name: `${translate(
                  `conditionMonitoring.centerLoad.generator`
                )}`,
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
                value: rotorSideValues(loadSenseResult),
                name: `${translate(`conditionMonitoring.centerLoad.rotor`)}`,
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

export const getAverageLoadGraphData = createSelector(
  getLoadAverageResult,
  (loadAverage: LoadSenseAvg): GraphData => {
    return (
      loadAverage && {
        series: [
          {
            name: `${translate(
              `conditionMonitoring.centerLoad.generatorAverage`
            )}`,
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: generatorSideAvgValues(loadAverage),
                name: `${translate(
                  `conditionMonitoring.centerLoad.generatorAverage`
                )}`,
              },
            ],
            areaStyle: {
              opacity: 0.1,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: `${translate(`conditionMonitoring.centerLoad.rotorAverage`)}`,
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: rotorSideAvgValues(loadAverage),
                name: `${translate(
                  `conditionMonitoring.centerLoad.rotorAverage`
                )}`,
              },
            ],
            areaStyle: {
              opacity: 0.1,
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
