import { createSelector } from '@ngrx/store';
import { getGreaseHeatmapStatusState as reducer } from '../../reducers';
import * as U from '../../../../shared/store/utils.selector';

export const getGCHeatmapResult = createSelector(reducer, U.getResult());
export const getGCHeatmapLoading = createSelector(reducer, U.getLoading());
