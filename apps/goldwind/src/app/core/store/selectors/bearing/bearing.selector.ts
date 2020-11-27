import { createSelector } from '@ngrx/store';

import { getBearingState } from '../../reducers';
import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { BearingMetadata } from '../../reducers/bearing/models';

export const getBearingLoading = createSelector(
  getBearingState,
  (state: BearingState) => state.loading
);

export const getBearingResult = createSelector(
  getBearingState,
  (state: BearingState) => state.result
);

export const getMainBearing = createSelector(
  getBearingResult,
  (state: BearingMetadata) => state && state.mainBearing
);

// highly WIP
export const getShaftDeviceId = createSelector(
  getBearingState,
  () => 'vm-windows-edge-gerlitm'
);

export const getShaftResult = createSelector(
  getBearingState,
  (state: BearingState) => state?.shaft?.result
);
