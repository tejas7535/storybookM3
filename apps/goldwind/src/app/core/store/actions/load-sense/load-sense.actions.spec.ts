import { getLoad, getLoadFailure, getLoadId, getLoadSuccess } from '..';

describe('LoadSense Actions', () => {
  let bearingId: string;

  beforeEach(() => {
    bearingId = '123';
  });
  describe('Get LoadSense Actions', () => {
    test('getLoadId', () => {
      const action = getLoadId();

      expect(action).toEqual({
        type: '[Load Sense] Load Load Id',
      });
    });
    test('getLoad', () => {
      const action = getLoad({ bearingId });

      expect(action).toEqual({
        bearingId,
        type: '[Load Sense] Get Load',
      });
    });

    test('getLoadSuccess', () => {
      const loadSense: any = {};
      const action = getLoadSuccess({ loadSense });

      expect(action).toEqual({
        loadSense,
        type: '[Load Sense] Get Load Success',
      });
    });

    test('getLoadFailure', () => {
      const action = getLoadFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Failure',
      });
    });
  });
});
