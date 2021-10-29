import { createSelector } from '@ngrx/store';

import { getBearingState } from '../../reducers';
import { BearingState } from '../../reducers/bearing/bearing.reducer';

export const getBearingLoading = createSelector(
  getBearingState,
  (state: BearingState): boolean => state.loading
);

export const getSelectedBearing = createSelector(
  getBearingState,
  (state: BearingState): string => state?.selectedBearing
);

export const getModelId = createSelector(
  getBearingState,
  (state: BearingState): string => state?.modelId
);

export const getModelCreationSuccess = createSelector(
  getBearingState,
  (state: BearingState): boolean => state?.modelCreationSuccess
);

export const getBearingResultList = createSelector(
  getBearingState,
  (state: BearingState): any =>
    state?.search?.resultList.map((bearing) => ({
      id: bearing,
      title: bearing,
    }))
);
