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
    it('getBearingId', () => {
      const action = getBearingId();

      expect(action).toEqual({
        type: '[Bearing] Load Bearing ID',
      });
    });

    it('getBearing', () => {
      const action = getBearing({ bearingId });

      expect(action).toEqual({
        bearingId,
        type: '[Bearing] Load Bearing',
      });
    });

    it('getBearingSuccess', () => {
      const bearing: any = {};
      const action = getBearingSuccess({ bearing });

      expect(action).toEqual({
        bearing,
        type: '[Bearing] Load Bearing Success',
      });
    });

    it('getBearingFailure', () => {
      const action = getBearingFailure();

      expect(action).toEqual({
        type: '[Bearing] Load Bearing Failure',
      });
    });
  });
});
