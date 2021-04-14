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

const rotorSideValues = (lsp: LoadSense): [number, number][] =>
  lsp && [
    [lsp.lsp01Strain, 0],
    [lsp.lsp03Strain, 45],
    [lsp.lsp05Strain, 90],
    [lsp.lsp07Strain, 135],
    [lsp.lsp09Strain, 180],
    [lsp.lsp11Strain, 225],
    [lsp.lsp13Strain, 270],
    [lsp.lsp15Strain, 315],
    [lsp.lsp01Strain, 0], // to make the full circe
  ];

const rotorSideAvgValues = (lsp: LoadSenseAvg): [number, number][] =>
  lsp && [
    [lsp.lsp01StrainAvg, 0],
    [lsp.lsp03StrainAvg, 45],
    [lsp.lsp05StrainAvg, 90],
    [lsp.lsp07StrainAvg, 135],
    [lsp.lsp09StrainAvg, 180],
    [lsp.lsp11StrainAvg, 225],
    [lsp.lsp13StrainAvg, 270],
    [lsp.lsp15StrainAvg, 315],
    [lsp.lsp01StrainAvg, 0], // to make the full circe
  ];

const generatorSideValues = (lsp: LoadSense): [number, number][] =>
  lsp && [
    [lsp.lsp02Strain, 22.5],
    [lsp.lsp04Strain, 67.5],
    [lsp.lsp06Strain, 112.5],
    [lsp.lsp08Strain, 157.5],
    [lsp.lsp10Strain, 202.5],
    [lsp.lsp12Strain, 247.5],
    [lsp.lsp14Strain, 292.5],
    [lsp.lsp16Strain, 337.5],
    [lsp.lsp02Strain, 22.5], // to make the full circe
  ];

const generatorSideAvgValues = (lsp: LoadSenseAvg): [number, number][] =>
  lsp && [
    [lsp.lsp02StrainAvg, 22.5],
    [lsp.lsp04StrainAvg, 67.5],
    [lsp.lsp06StrainAvg, 112.5],
    [lsp.lsp08StrainAvg, 157.5],
    [lsp.lsp10StrainAvg, 202.5],
    [lsp.lsp12StrainAvg, 247.5],
    [lsp.lsp14StrainAvg, 292.5],
    [lsp.lsp16StrainAvg, 337.5],
    [lsp.lsp02StrainAvg, 22.5], // to make the full circe
  ];

export const tooltipFormatter = (
  params: any,
  loadSenseResult: LoadSense | LoadSenseAvg
): string => {
  let result;
  const { seriesName } = params.pop();
  const loadSense = loadSenseResult as any;

  if (
    seriesName === `${translate(`conditionMonitoring.centerLoad.rotor`)}` ||
    seriesName === `${translate(`conditionMonitoring.centerLoad.rotorAverage`)}`
  ) {
    result = `${seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp01Strain || loadSense.lsp01StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp03Strain || loadSense.lsp03StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp05Strain || loadSense.lsp05StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp07Strain || loadSense.lsp07StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp09Strain || loadSense.lsp09StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 11:&nbsp;&nbsp;${(
        loadSense.lsp11Strain || loadSense.lsp11StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 13:&nbsp;&nbsp;${(
        loadSense.lsp13Strain || loadSense.lsp13StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 15:&nbsp;&nbsp;${(
        loadSense.lsp15Strain || loadSense.lsp15StrainAvg
      ).toLocaleString(DATE_FORMAT.local, {
        maximumFractionDigits: 0,
      })} N<br />`;
  }
  if (
    seriesName === `${translate(`conditionMonitoring.centerLoad.generator`)}` ||
    seriesName ===
      `${translate(`conditionMonitoring.centerLoad.generatorAverage`)}`
  ) {
    result = `${seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp02Strain || loadSense.lsp02StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp04Strain || loadSense.lsp04StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp06Strain || loadSense.lsp06StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;${(
        loadSense.lsp08Strain || loadSense.lsp08StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 10:&nbsp;&nbsp;${(
        loadSense.lsp10Strain || loadSense.lsp10StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 12:&nbsp;&nbsp;${(
        loadSense.lsp12Strain || loadSense.lsp12StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 14:&nbsp;&nbsp;${(
        loadSense.lsp14Strain || loadSense.lsp14StrainAvg
      ).toLocaleString(DATE_FORMAT.local, { maximumFractionDigits: 0 })} N<br />
      Lsp 16:&nbsp;&nbsp;${(
        loadSense.lsp16Strain || loadSense.lsp16StrainAvg
      ).toLocaleString(DATE_FORMAT.local, {
        maximumFractionDigits: 0,
      })} N<br />`;
  }
  return result;
};

export const getLoadGraphData = createSelector(
  getBearingLoadLatestResult,
  (loadSenseResult: LoadSense): GraphData => {
    return (
      loadSenseResult && {
        tooltip: {
          formatter: (params: any) => tooltipFormatter(params, loadSenseResult),
        },
        series: [
          {
            name: `${translate(`conditionMonitoring.centerLoad.generator`)}`,
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,
            data: generatorSideValues(loadSenseResult),
            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: `${translate(`conditionMonitoring.centerLoad.rotor`)}`,
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',

            smooth: false,
            data: rotorSideValues(loadSenseResult),
            areaStyle: {
              opacity: 0.5,
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
        tooltip: {
          formatter: (params: any) => tooltipFormatter(params, loadAverage),
        },
        series: [
          {
            name: `${translate(
              `conditionMonitoring.centerLoad.generatorAverage`
            )}`,
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,
            data: generatorSideAvgValues(loadAverage),
            areaStyle: {
              opacity: 0.5,
            },
            itemStyle: {
              color: GaugeColors.GREEN,
            },
          },
          {
            name: `${translate(`conditionMonitoring.centerLoad.rotorAverage`)}`,
            symbol: 'none',
            type: 'line',
            coordinateSystem: 'polar',
            smooth: false,
            data: rotorSideAvgValues(loadAverage),
            areaStyle: {
              opacity: 0.5,
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
