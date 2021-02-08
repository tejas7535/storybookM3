import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '..';

describe('Shaft Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'my-test-device-id';
  });

  describe('Get Shaft Actions', () => {
    test('getShaftId', () => {
      const action = getShaftId();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft ID',
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
      const action = stopGetShaft();

      expect(action).toEqual({
        type: '[Shaft] Stop Load Shaft',
      });
    });

    test('geShaftFailure', () => {
      const action = getShaftFailure();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft Failure',
      });
    });

    test('getShaftSuccess', () => {
      const shaft: any = {};
      const action = getShaftSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Shaft] Load Shaft Success',
      });
    });
  });
});
