import { SensorData } from '../../reducers/data-view/models';
import {
  getData,
  getDataFailure,
  getDataId,
  getDataSuccess,
  setDataInterval,
} from '..';
import { setFrequency } from './data-view.actions';

describe('DataMonitor Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'this-has-to-change';
  });

  describe('Get Data View Actions', () => {
    it('getDataId', () => {
      const action = getDataId();

      expect(action).toEqual({
        type: '[Data View] Load Data Device ID',
      });
    });

    it('getData', () => {
      const action = getData({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Data View] Load Data',
      });
    });

    it('getDataSuccess', () => {
      const result: SensorData[] = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635,
          minValue: 1700,
          maxValue: 1900,
        },
      ];
      const action = getDataSuccess({ result });

      expect(action).toEqual({
        result,
        type: '[Data View] Load Data Success',
      });
    });

    it('getDataFailure', () => {
      const action = getDataFailure();

      expect(action).toEqual({
        type: '[Data View] Load Data Failure',
      });
    });

    it('setDataInterval', () => {
      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };
      const action = setDataInterval({ interval: mockInterval });

      expect(action).toEqual({
        interval: mockInterval,
        type: '[Data View] Set Interval',
      });
    });

    it('setFrequency', () => {
      const mockFrequency = 100;

      const action = setFrequency({ frequency: mockFrequency });

      expect(action).toEqual({
        frequency: mockFrequency,
        type: '[Data View] Set Frequency',
      });
    });
  });
});
