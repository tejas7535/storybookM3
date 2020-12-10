import { createSelector } from '@ngrx/store';

import { MaterialDetails } from '../../models';
import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail-case/detail-case.reducer';

export const getMaterialDetails = createSelector(
  getDetailState,
  (state: DetailState): MaterialDetails => state.detailCase.materialDetails
);

export const getMaterialNumberAndDescription = createSelector(
  getDetailState,
  (state: DetailState): any => ({
    materialNumber15: state.detailCase.materialNumber15,
    materialDescription: state.detailCase.materialDetails
      ? state.detailCase.materialDetails.materialDesignation
      : undefined,
  })
);

export const isMaterialLoading = createSelector(
  getDetailState,
  (state: DetailState): boolean => state.detailCase.materialLoading
);
