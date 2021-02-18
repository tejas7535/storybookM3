import { createSelector } from '@ngrx/store';

import { getDevicesState } from '../../reducers';
import { DevicesState } from '../../reducers/devices/devices.reducer';

export const getDevicesLoading = createSelector(
  getDevicesState,
  (state: DevicesState) => state.loading
);

export const getDevicesResult = createSelector(
  getDevicesState,
  (state: DevicesState) =>
    state.result &&
    state.result.length > 0 &&
    [...state.result]
      .sort((a, b) =>
        (a.connectionState as any) < (b.connectionState as any) ? -1 : 1
      )
      .sort((a, b) => ((a.deviceId as any) < (b.deviceId as any) ? -1 : 1))
);
