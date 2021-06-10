import { initialState } from '../../reducers/devices/devices.reducer';
import { ConnectionState } from '../../reducers/devices/models/devices.model';
import { getDevicesLoading, getDevicesResult } from './devices.selector';

describe('Devices Selector', () => {
  const fakeState = {
    devices: {
      ...initialState,
      result: [
        {
          deviceId: 'TestDeviceID2',
          connectionState: ConnectionState.connected,
        },
        {
          deviceId: 'TestDeviceID3',
          connectionState: ConnectionState.connected,
        },
        {
          deviceId: 'TestDeviceID',
          connectionState: ConnectionState.disconnected,
        },
      ],
      loading: false,
    },
  };

  describe('getDevicesLoading', () => {
    it('should return loading status', () => {
      expect(getDevicesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getDevicesResult', () => {
    it('should return a devices', () => {
      expect(getDevicesResult(fakeState)).toEqual(fakeState.devices.result);
    });
  });
});
