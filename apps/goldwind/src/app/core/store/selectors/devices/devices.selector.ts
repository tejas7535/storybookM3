import { createSelector } from '@ngrx/store';

import { getDevicesState } from '../../reducers';
import { DevicesState } from '../../reducers/devices/devices.reducer';
import { ConnectionState } from '../../reducers/devices/models';

export const getDevicesLoading = createSelector(
  getDevicesState,
  (state: DevicesState) => state.loading
);

export const getDevicesResult = createSelector(
  getDevicesState,
  (state: DevicesState) =>
    state.result && state.result.length > 0 // temporary solution until call works correctly
      ? state.result
      : [
          {
            deviceId: 'goldwind-qa-002',
            moduleId: undefined,
            version: 1,
            reportedProperties: undefined,
            desiredProperties: undefined,
            configurations: undefined,
            capabilities: {
              iotEdge: undefined,
            },
            connectionState: ConnectionState.connected,
            tags: undefined,
            tagsVersion: undefined,
            desiredPropertiesVersion: undefined,
            reportedPropertiesVersion: undefined,
            etag: undefined,
          },
        ]
);
