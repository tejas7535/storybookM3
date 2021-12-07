import { createSelector } from '@ngrx/store';

import { CenterLoadStatus } from '../../../../shared/models';
import { getLoading, getResult } from '../../../../shared/store/utils.selector';
import { getCenterLoadState } from '../../reducers';

export const getCenterLoadResult = createSelector(
  getCenterLoadState,
  getResult<CenterLoadStatus>()
);

export const getCenterLoadLoading = createSelector(
  getCenterLoadState,
  getLoading<CenterLoadStatus>()
);
