import { initialState } from '../../reducers/devices/devices.reducer';
import { getDevicesLoading, getDevicesResult } from './devices.selector';

describe('Devices Selector', () => {
  const fakeState = {
    devices: {
      ...initialState,
      result: [
        {
          deviceId: 'TestDeviceID',
        },
      ],
      loading: false,
    },
  };

  describe('getDevicesLoading', () => {
    test('should return loading status', () => {
      expect(getDevicesLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getDevicesResult', () => {
    test('should return a devices', () => {
      expect(getDevicesResult(fakeState)).toEqual(fakeState.devices.result);
    });
  });
});
