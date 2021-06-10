import { getDevices, getDevicesFailure, getDevicesSuccess } from '..';

describe('Devices Actions', () => {
  describe('Get Devices Actions', () => {
    it('getDevices', () => {
      const action = getDevices();

      expect(action).toEqual({
        type: '[Devices] Load Devices',
      });
    });

    it('getDevicesSuccess', () => {
      const devices: any = {};
      const action = getDevicesSuccess({ devices });

      expect(action).toEqual({
        devices,
        type: '[Devices] Load Devices Success',
      });
    });

    it('getDevicesFailure', () => {
      const action = getDevicesFailure();

      expect(action).toEqual({
        type: '[Devices] Load Devices Failure',
      });
    });
  });
});
