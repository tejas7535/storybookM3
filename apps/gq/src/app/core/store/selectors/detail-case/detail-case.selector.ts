import { createSelector } from '@ngrx/store';

import { MaterialDetails } from '../../models';
import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail-case/detail-case.reducer';

export const getMaterialDetails = createSelector(
  getDetailState,
  (state: DetailState): MaterialDetails => state.detailCase.materialDetails
);
export const getMaterialNumber15 = createSelector(
  getDetailState,
  (state: DetailState): string => state.detailCase.materialNumber15
);
