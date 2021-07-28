import { createSelector } from '@ngrx/store';
import { getCenterLoadState } from '../../reducers';
import { getResult, getLoading } from '../../../../shared/store/utils.selector';
import { CenterLoadStatus } from '../../../../shared/models';

export const getCenterLoadResult = createSelector(
  getCenterLoadState,
  getResult<CenterLoadStatus>()
);

export const getCenterLoadLoading = createSelector(
  getCenterLoadState,
  getLoading<CenterLoadStatus>()
);
