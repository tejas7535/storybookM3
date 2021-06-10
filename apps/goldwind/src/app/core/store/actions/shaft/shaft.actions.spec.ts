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
    it('getShaftId', () => {
      const source = 'fantasy-route';
      const action = getShaftId({ source });

      expect(action).toEqual({
        source,
        type: '[Shaft] Load Shaft ID',
      });
    });

    it('getShaftLatest', () => {
      const action = getShaftLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Shaft] Load Shaft Latest',
      });
    });

    it('geShaftLatestFailure', () => {
      const action = getShaftLatestFailure();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft Latest Failure',
      });
    });

    it('getShaftLatestSuccess', () => {
      const shaft: any = {};
      const action = getShaftLatestSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Shaft] Load Shaft Latest Success',
      });
    });

    it('getShaft', () => {
      const action = getShaft({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Shaft] Load Shaft',
      });
    });

    it('stopGetShaft', () => {
      const action = stopGetShaftLatest();

      expect(action).toEqual({
        type: '[Shaft] Stop Load Shaft Latest',
      });
    });

    it('geShaftFailure', () => {
      const action = getShaftFailure();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft Failure',
      });
    });

    it('getShaftSuccess', () => {
      const shaft: any = [{}];
      const action = getShaftSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Shaft] Load Shaft Success',
      });
    });
  });
});
