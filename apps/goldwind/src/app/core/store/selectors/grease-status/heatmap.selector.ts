import { createSelector } from '@ngrx/store';

import { GCMHeatmapEntry } from '../../../../shared/models';
import * as U from '../../../../shared/store/utils.selector';
import { getGreaseHeatmapStatusState as reducer } from '../../reducers';
import { HeatmapResponseConvert } from './heatmap-response-series-converter';

export const getGCHeatmapResult = createSelector(
  reducer,
  U.getResult<GCMHeatmapEntry>()
);

export const getGCHeatmapLoading = createSelector(reducer, U.getLoading());

export const getGCHeatmapGraph = createSelector(
  getGCHeatmapResult,
  (data: GCMHeatmapEntry[]): any => ({
    series: new HeatmapResponseConvert(data).series,
  })
);
