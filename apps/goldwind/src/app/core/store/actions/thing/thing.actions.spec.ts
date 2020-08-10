import {
  getThing,
  getThingEdm,
  getThingEdmFailure,
  getThingEdmId,
  getThingEdmSuccess,
  getThingFailure,
  getThingId,
  getThingSuccess,
} from '..';
import { Edm } from '../../reducers/thing/models';

describe('Thing Actions', () => {
  let thingId: number;
  let sensorId: string;

  beforeEach(() => {
    thingId = 123;
    sensorId = 'was1-ist2-los3';
  });

  describe('Get Thing Actions', () => {
    test('getThingId', () => {
      const action = getThingId();

      expect(action).toEqual({
        type: '[Thing] Load Thing ID',
      });
    });

    test('getThing', () => {
      const action = getThing({ thingId });

      expect(action).toEqual({
        thingId,
        type: '[Thing] Load Thing',
      });
    });

    test('getThingSuccess', () => {
      const thing: any = {};
      const action = getThingSuccess({ thing });

      expect(action).toEqual({
        thing,
        type: '[Thing] Load Thing Success',
      });
    });

    test('getThingFailure', () => {
      const action = getThingFailure();

      expect(action).toEqual({
        type: '[Thing] Load Thing Failure',
      });
    });

    test('getThingEdmId', () => {
      const action = getThingEdmId();

      expect(action).toEqual({
        type: '[Thing] Load Thing EDM Sensor ID',
      });
    });

    test('getThingEdm', () => {
      const action = getThingEdm({ sensorId });

      expect(action).toEqual({
        sensorId,
        type: '[Thing] Load Thing EDM',
      });
    });

    test('getThingEdmSuccess', () => {
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
      const action = getThingEdmSuccess({ measurements });

      expect(action).toEqual({
        measurements,
        type: '[Thing] Load Thing EDM Success',
      });
    });

    test('getThingEdmFailure', () => {
      const action = getThingEdmFailure();

      expect(action).toEqual({
        type: '[Thing] Load Thing EDM Failure',
      });
    });
  });
});
