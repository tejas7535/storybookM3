import { EdmStatus } from '../../reducers/edm-monitor/models';
import { initialState } from '../../reducers/shaft/shaft.reducer';
import { getAnalysisGraphDataM } from './maintenance-assessment.selector';

describe('Load Sense Selector', () => {
  const mockState = {
    maintenanceAssessment: {
      result: [
        {
          timestamp: '2020-07-31T11:02:35.000Z',
          gcm: {
            gcm01TemperatureOptics: 99.991,
            gcm01Deterioration: 12.121,
            gcm01WaterContent: 69,
            gcm02TemperatureOptics: 33.333,
            gcm02Deterioration: 22,
            gcm02WaterContent: 11.111,
          },
          edm: {
            edm01Ai01Counter: 1,
            edm01Ai02Counter: 2,
          },
          rsmShaft: {
            rsm01ShaftSpeed: 3,
            rsm01ShaftCounterValue: 666,
          },
        },
      ],
      display: {
        waterContent_1: true,
        edm01Ai02Counter: true,
      },
      interval: {
        startDate: 123_456_789,
        endDate: 987_654_321,
      },
    },
  };

  describe('getAnalysisGraphDataM', () => {
    it('should return', () => {
      const expected = {
        xAxis: {
          max: new Date('2001-04-19T04:25:21.000Z'),
          min: new Date('1973-11-29T21:33:09.000Z'),
        },
        legend: { data: ['waterContent_1', 'edm01Ai02Counter'] },
        series: [
          {
            data: [{ value: [new Date('2020-07-31T11:02:35.000Z'), '69.00'] }],
            name: 'waterContent_1',
            symbol: 'none',
            type: 'line',
            lineStyle: {
              color: '#52B796',
            },
          },
          {
            data: [{ value: [new Date('2020-07-31T11:02:35.000Z'), 2] }],
            name: 'edm01Ai02Counter',
            symbol: 'none',
            type: 'line',
            lineStyle: {
              color: '#2296F0',
            },
          },
        ],
      };
      expect(getAnalysisGraphDataM(mockState)).toEqual(expected);
    });
  });
});
