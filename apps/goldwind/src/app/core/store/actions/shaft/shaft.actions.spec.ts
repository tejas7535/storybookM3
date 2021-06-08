import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftLatest,
  getShaftLatestFailure,
  getShaftLatestSuccess,
  getShaftSuccess,
  stopGetShaftLatest,
} from '..';

describe('Shaft Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'my-test-device-id';
  });

  describe('Get Shaft Actions', () => {
    test('getShaftId', () => {
      const source = 'fantasy-route';
      const action = getShaftId({ source });

      expect(action).toEqual({
        source,
        type: '[Shaft] Load Shaft ID',
      });
    });

    test('getShaftLatest', () => {
      const action = getShaftLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Shaft] Load Shaft Latest',
      });
    });

    test('geShaftLatestFailure', () => {
      const action = getShaftLatestFailure();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft Latest Failure',
      });
    });

    test('getShaftLatestSuccess', () => {
      const shaft: any = {};
      const action = getShaftLatestSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Shaft] Load Shaft Latest Success',
      });
    });

    test('getShaft', () => {
      const action = getShaft({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Shaft] Load Shaft',
      });
    });

    test('stopGetShaft', () => {
      const action = stopGetShaftLatest();

      expect(action).toEqual({
        type: '[Shaft] Stop Load Shaft Latest',
      });
    });

    test('geShaftFailure', () => {
      const action = getShaftFailure();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft Failure',
      });
    });

    test('getShaftSuccess', () => {
      const shaft: any = [{}];
      const action = getShaftSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Shaft] Load Shaft Success',
      });
    });
  });
});
