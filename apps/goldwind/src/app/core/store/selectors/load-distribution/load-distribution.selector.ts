import { createSelector } from '@ngrx/store';

import { getLoadDistributionState } from '../..';
import { LoadDistributionState } from '../../reducers/load-distribution/load-distribution.reducer';
import { PolarSeriesGenerator } from './polar-series-generator.class';
import { LoadDistribution } from './load-distribution.interface';
import { LoadSense } from '../../reducers/load-sense/models';

export const sRow1 = createSelector(
  getLoadDistributionState,
  (state: LoadDistributionState) => state?.result.row1
);

export const sRow2 = createSelector(
  getLoadDistributionState,
  (state: LoadDistributionState) => state?.result.row2
);

export const sLSP = createSelector(
  getLoadDistributionState,
  (state: LoadDistributionState) => state?.result.lsp
);

export const getLoadDistributionTimeStamp = createSelector(
  sRow1,
  (state) => state?.timestamp
);

export const getLoadDistributionSeries = createSelector(
  sRow1,
  sRow2,
  sLSP,
  (row1: LoadDistribution, row2: LoadDistribution, lsp: LoadSense): any =>
    row1 &&
    row2 &&
    lsp && {
      series: [
        new PolarSeriesGenerator({
          color: '#2196F3',
          name: 'Rotor Load',
        }).getSeries(row1),
        new PolarSeriesGenerator({
          color: '#6A8186',
          name: 'Generator Load',
        }).getSeries(row2),
        new PolarSeriesGenerator({
          color: '#2196F3',
          name: 'Rotor Load LSP',
        }).getSeriesDots(lsp, false),
        new PolarSeriesGenerator({
          color: '#6A8186',
          name: 'Generator Load LSP',
        }).getSeriesDots(lsp, true),
      ],
    }
);
