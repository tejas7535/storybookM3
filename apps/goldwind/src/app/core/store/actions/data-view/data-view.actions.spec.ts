import {
  getData,
  getDataFailure,
  getDataId,
  getDataSuccess,
  setDataInterval,
} from '..';
import { SensorData } from '../../reducers/data-view/models';
import { setFrequency } from './data-view.actions';

describe('DataMonitor Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'this-has-to-change';
  });

  describe('Get Data View Actions', () => {
    test('getDataId', () => {
      const action = getDataId();

      expect(action).toEqual({
        type: '[Data View] Load Data Device ID',
      });
    });

    test('getData', () => {
      const action = getData({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Data View] Load Data',
      });
    });

    test('getDataSuccess', () => {
      const result: SensorData[] = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
        },
      ];
      const action = getDataSuccess({ result });

      expect(action).toEqual({
        result,
        type: '[Data View] Load Data Success',
      });
    });

    test('getDataFailure', () => {
      const action = getDataFailure();

      expect(action).toEqual({
        type: '[Data View] Load Data Failure',
      });
    });

    test('setDataInterval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setDataInterval({ interval: mockInterval });

      expect(action).toEqual({
        interval: mockInterval,
        type: '[Data View] Set Interval',
      });
    });

    test('setFrequency', () => {
      const mockFrequency = 100;

      const action = setFrequency({ frequency: mockFrequency });

      expect(action).toEqual({
        frequency: mockFrequency,
        type: '[Data View] Set Frequency',
      });
    });
  });
});
