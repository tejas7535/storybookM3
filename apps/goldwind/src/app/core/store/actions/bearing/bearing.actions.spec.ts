import {
  getBearing,
  getBearingFailure,
  getBearingId,
  getBearingSuccess,
} from '..';

describe('Bearing Actions', () => {
  let bearingId: string;

  beforeEach(() => {
    bearingId = '123';
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
  });
});
