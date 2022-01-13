import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { DATE_FORMAT } from '../../../../shared/constants';
import { getBearingLoadState } from '../../reducers';
import { BearingLoadState } from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense } from '../../reducers/load-sense/models';
import { GraphData } from '../../reducers/shared/models';

// Will at some point only return true if last result is not too old
export const getLoadLatestLoading = createSelector(
  getBearingLoadState,
  (state: BearingLoadState) => state?.status.loading
);

export const getLoadAverageLoading = createSelector(
  getBearingLoadState,
  (state: BearingLoadState) => state?.averageResult.loading
);

export const getBearingLoadResult = createSelector(
  getBearingLoadState,
  (state: BearingLoadState) => state?.result
);

export const getBearingLoadLatestResult = createSelector(
  getBearingLoadState,
  (state: BearingLoadState) => state?.status?.result
);

export const getLoadAverageResult = createSelector(
  getBearingLoadState,
  (state: BearingLoadState) => state?.averageResult.result
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

export const tooltipFormatter = (
  params: any,
  loadSenseResult: LoadSense
): string => {
  let result;
  const { seriesName } = params.pop();
  const loadSense = loadSenseResult as any;
  const digits = { maximumFractionDigits: 0 };

  if (
    (loadSense &&
      seriesName === `${translate(`conditionMonitoring.centerLoad.rotor`)}`) ||
    seriesName === `${translate(`conditionMonitoring.centerLoad.rotorAverage`)}`
  ) {
    result = `${seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp01Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp03Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp05Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp07Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp09Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 11:&nbsp;&nbsp;${loadSense.lsp11Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 13:&nbsp;&nbsp;${loadSense.lsp13Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 15:&nbsp;&nbsp;${loadSense.lsp15Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />`;
  }
  if (
    seriesName === `${translate(`conditionMonitoring.centerLoad.generator`)}` ||
    seriesName ===
      `${translate(`conditionMonitoring.centerLoad.generatorAverage`)}`
  ) {
    result = `${seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp02Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp04Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp06Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;${loadSense.lsp08Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 10:&nbsp;&nbsp;${loadSense.lsp10Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 12:&nbsp;&nbsp;${loadSense.lsp12Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 14:&nbsp;&nbsp;${loadSense.lsp14Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />
      Lsp 16:&nbsp;&nbsp;${loadSense.lsp16Strain.toLocaleString(
        DATE_FORMAT.local,
        digits
      )} N<br />`;
  }

  return result;
};

const polarSeries = (color: string, name: string) => ({
  name: `${translate(name)}`,
  symbol: 'none',
  type: 'line',
  coordinateSystem: 'polar',
  smooth: false,
  areaStyle: {
    opacity: 0.5,
  },
  itemStyle: {
    color,
  },
});

export const generateRotorSeries = (
  name: string,
  loadSenseResult: LoadSense
) => ({
  ...polarSeries('#854B85', name),
  data: rotorSideValues(loadSenseResult),
});

export const generateGeneratorSeries = (
  name: string,
  loadSenseResult: LoadSense
) => ({
  ...polarSeries('#1D9BB2', name),
  data: generatorSideValues(loadSenseResult),
});

export const getLoadGraphData = createSelector(
  getBearingLoadLatestResult,
  (loadSenseResult: LoadSense): GraphData =>
    loadSenseResult && {
      tooltip: {
        formatter: (params: any) => tooltipFormatter(params, loadSenseResult),
      },
      series: [
        generateGeneratorSeries(
          `conditionMonitoring.centerLoad.generator`,
          loadSenseResult
        ),
        generateRotorSeries(
          `conditionMonitoring.centerLoad.rotor`,
          loadSenseResult
        ),
      ],
    }
);

export const getAverageLoadGraphData = createSelector(
  getLoadAverageResult,
  (loadSenseResult: LoadSense): any =>
    loadSenseResult && {
      tooltip: {
        formatter: (params: any) => tooltipFormatter(params, loadSenseResult),
      },
      series: [
        generateGeneratorSeries(
          `conditionMonitoring.centerLoad.generatorAverage`,
          loadSenseResult
        ),
        generateRotorSeries(
          `conditionMonitoring.centerLoad.rotorAverage`,
          loadSenseResult
        ),
      ],
    }
);
