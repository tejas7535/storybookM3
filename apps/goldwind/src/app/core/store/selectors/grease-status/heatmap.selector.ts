import { createSelector } from '@ngrx/store';
import { getGreaseHeatmapStatusState as reducer } from '../../reducers';
import * as U from '../../../../shared/store/utils.selector';
import { GCMHeatmapEntry } from '../../../../shared/models';
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
