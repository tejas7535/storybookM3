import { initialState } from '../../reducers/edm-monitor/edm-monitor.reducer';
import { AntennaName } from '../../reducers/edm-monitor/models';
import {
  getEdmGraphData,
  getEdmInterval,
  getEdmResult,
} from './edm-monitor.selector';

describe('EdmMonitor Selector', () => {
  const fakeState = {
    edmMonitor: {
      ...initialState,
      loading: false,
      measurements: [
        {
          startDate: '2020-07-30T11:02:25',
          edmValue1Counter: 100,
          edmValue2Counter: 200,
          edmValue1CounterMax: 300,
          edmValue2CounterMax: 400,
        },
      ],
      interval: {
        startDate: 123456789,
        endDate: 987654321,
      },
    },
  };

  describe('getEdmResult', () => {
    test('should return EDM measurements', () => {
      expect(getEdmResult(fakeState)).toEqual(
        fakeState.edmMonitor.measurements
      );
    });
  });

  describe('getEdmGraphData', () => {
    test('should return graph series data value tupels', () => {
      const expectedResult = {
        legend: { data: ['edmValue1Counter', 'edmValue1CounterMax'] },
        series: [
          {
            name: 'edmValue1Counter',
            type: 'bar',
            data: [{ value: [new Date('2020-07-30T11:02:25'), 100] }],
          },
          {
            name: 'edmValue1CounterMax',
            type: 'line',
            data: [{ value: [new Date('2020-07-30T11:02:25'), 300] }],
          },
        ],
      };

      expect(
        getEdmGraphData(fakeState, { sensorName: AntennaName.Antenna1 })
      ).toEqual(expectedResult);
    });
  });

  describe('getEdmInterval', () => {
    test('should return a time interval with two timestamps', () => {
      expect(getEdmInterval(fakeState)).toEqual(fakeState.edmMonitor.interval);
    });
  });
});
