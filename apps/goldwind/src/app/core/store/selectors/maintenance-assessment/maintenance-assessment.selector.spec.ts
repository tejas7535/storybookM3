import { getAnalysisGraphDataM } from './maintenance-assessment.selector';

describe('Load Sense Selector', () => {
  const mockState = {
    greaseStatus: {
      result: [
        {
          timestamp: '2020-07-30T11:02:35',
          gcm01TemperatureOptics: 99.991,
          gcm01Deterioration: 12.121,
          gcm01WaterContent: 69,
          gcm02TemperatureOptics: 33.333,
          gcm02Deterioration: 22,
          gcm02WaterContent: 11.111,
        },
      ],
      loading: false,
      status: {
        result: {
          timestamp: '2020-07-31T11:02:35',
          gcm01TemperatureOptics: 99.99,
          gcm01Deterioration: 55.55,
          gcm01WaterContent: 12.55,
          gcm02TemperatureOptics: 33.333,
          gcm02Deterioration: 22,
          gcm02WaterContent: 11.111,
        },
        loading: false,
      },
    },
    maintenanceAssessment: {
      display: {
        waterContent_1: true,
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
        legend: { data: ['waterContent_1'] },
        series: [
          {
            data: [{ value: [new Date('2020-07-30T09:02:35.000Z'), '69.00'] }],
            name: 'waterContent_1',
            symbol: 'none',
            type: 'line',
          },
        ],
      };
      expect(getAnalysisGraphDataM(mockState)).toEqual(expected);
    });
  });
});
