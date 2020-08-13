import { getEdm, getEdmFailure, getEdmId, getEdmSuccess } from '..';
import { Edm } from '../../reducers/condition-monitoring/models';

describe('ConditionMonitoring Actions', () => {
  let sensorId: string;

  beforeEach(() => {
    sensorId = 'was1-ist2-los3';
  });

  describe('Get ConditionMonitoring Actions', () => {
    test('getEdmId', () => {
      const action = getEdmId();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Load EDM Sensor ID',
      });
    });

    test('getEdm', () => {
      const action = getEdm({ sensorId });

      expect(action).toEqual({
        sensorId,
        type: '[ConditionMonitoring] Load EDM',
      });
    });

    test('getEdmSuccess', () => {
      const measurements: Edm = [
        {
          id: 0,
          sensorId: 'fantasyID',
          endDate: '2020-07-30T11:02:35',
          startDate: '2020-07-30T11:02:25',
          sampleRatio: 500,
          edmValue1Counter: 100,
          edmValue2Counter: 200,
        },
      ];
      const action = getEdmSuccess({ measurements });

      expect(action).toEqual({
        measurements,
        type: '[ConditionMonitoring] Load EDM Success',
      });
    });

    test('getEdmFailure', () => {
      const action = getEdmFailure();

      expect(action).toEqual({
        type: '[ConditionMonitoring] Load EDM Failure',
      });
    });
  });
});
