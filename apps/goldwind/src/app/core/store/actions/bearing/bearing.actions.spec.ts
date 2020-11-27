import {
  getBearing,
  getBearingFailure,
  getBearingId,
  getBearingSuccess,
  getShaft,
  getShaftFailure,
  getShaftId,
  getShaftSuccess,
} from '..';

describe('Bearing Actions', () => {
  let bearingId: string;
  let shaftDeviceId: string;

  beforeEach(() => {
    bearingId = '123';
    shaftDeviceId = '123';
  });

  describe('Get Bearing Actions', () => {
    test('getBearingId', () => {
      const action = getBearingId();

      expect(action).toEqual({
        type: '[Bearing] Load Bearing ID',
      });
    });

    test('getBearing', () => {
      const action = getBearing({ bearingId });

      expect(action).toEqual({
        bearingId,
        type: '[Bearing] Load Bearing',
      });
    });

    test('getBearingSuccess', () => {
      const bearing: any = {};
      const action = getBearingSuccess({ bearing });

      expect(action).toEqual({
        bearing,
        type: '[Bearing] Load Bearing Success',
      });
    });

    test('getBearingFailure', () => {
      const action = getBearingFailure();

      expect(action).toEqual({
        type: '[Bearing] Load Bearing Failure',
      });
    });

    test('getShaftId', () => {
      const action = getShaftId();

      expect(action).toEqual({
        type: '[Bearing] Load Shaft ID',
      });
    });

    test('getShaft', () => {
      const action = getShaft({ shaftDeviceId });

      expect(action).toEqual({
        shaftDeviceId,
        type: '[Bearing] Load Shaft',
      });
    });

    test('getBearingSuccess', () => {
      const shaft: any = {};
      const action = getShaftSuccess({ shaft });

      expect(action).toEqual({
        shaft,
        type: '[Bearing] Load Shaft Success',
      });
    });

    test('geShaftFailure', () => {
      const action = getShaftFailure();

      expect(action).toEqual({
        type: '[Bearing] Load Shaft Failure',
      });
    });
  });
});
