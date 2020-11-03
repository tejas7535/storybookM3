import { getLoad, getLoadFailure, getLoadId, getLoadSuccess } from '..';

describe('ConditionMonitoring Actions', () => {
  let bearingId: string;

  beforeEach(() => {
    bearingId = '123';
  });
  describe('Get ConditionMonitoring Actions', () => {
    test('getLoadId', () => {
      const action = getLoadId();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Load Load Id',
      });
    });
    test('getLoad', () => {
      const action = getLoad({ bearingId });

      expect(action).toEqual({
        bearingId,
        type: '[ConditionMonitoring] Get Load',
      });
    });

    test('getLoadSuccess', () => {
      const id: any = {};
      const body: any = {};
      const action = getLoadSuccess({ id, body });

      expect(action).toEqual({
        id,
        body,
        type: '[ConditionMonitoring] Get Load Success',
      });
    });

    test('getLoadFailure', () => {
      const action = getLoadFailure();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Get Load Failure',
      });
    });
  });
});
