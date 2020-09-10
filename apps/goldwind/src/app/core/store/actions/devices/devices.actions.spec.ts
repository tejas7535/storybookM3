import { getDevices, getDevicesFailure, getDevicesSuccess } from '..';

describe('Devices Actions', () => {
  describe('Get Devices Actions', () => {
    test('getDevices', () => {
      const action = getDevices();

      expect(action).toEqual({
        type: '[Devices] Load Devices',
      });
    });

    test('getDevicesSuccess', () => {
      const devices: any = {};
      const action = getDevicesSuccess({ devices });

      expect(action).toEqual({
        devices,
        type: '[Devices] Load Devices Success',
      });
    });

    test('getDevicesFailure', () => {
      const action = getDevicesFailure();

      expect(action).toEqual({
        type: '[Devices] Load Devices Failure',
      });
    });
  });
});
