import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
  getLoadId,
} from '..';

describe('LoadSense Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = '123';
  });
  describe('Get LoadSense Actions', () => {
    test('getLoadId', () => {
      const action = getLoadId();

      expect(action).toEqual({
        type: '[Load Sense] Load Load Id',
      });
    });
    test('getBearingLoadLatest', () => {
      const action = getBearingLoadLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load',
      });
    });

    test('getBearingLoadSuccess', () => {
      const bearingLoadLatest: any = {};
      const action = getBearingLoadSuccess({ bearingLoadLatest });

      expect(action).toEqual({
        bearingLoadLatest,
        type: '[Load Sense] Get Load Success',
      });
    });

    test('getBearingLoadFailure', () => {
      const action = getBearingLoadFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Failure',
      });
    });
  });
});
