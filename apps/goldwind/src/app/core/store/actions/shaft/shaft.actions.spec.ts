import {
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
  stopGetShaft,
} from '..';

describe('Shaft Actions', () => {
  let shaftDeviceId: string;

  beforeEach(() => {
    shaftDeviceId = '123';
  });

  describe('Get Shaft Actions', () => {
    test('getShaftId', () => {
      const action = getShaftId();

      expect(action).toEqual({
        type: '[Shaft] Load Shaft ID',
      });
    });

    test('getShaft', () => {
      const action = getShaft({ shaftDeviceId });

      expect(action).toEqual({
        shaftDeviceId,
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
