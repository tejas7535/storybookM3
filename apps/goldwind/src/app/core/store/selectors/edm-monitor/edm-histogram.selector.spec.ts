import { initialState } from '../../reducers/edm-monitor/edm-histogram.reducer';
import { getEdmHeatmapSeries, getEdmHistogramResult } from '..';

describe('Edm Historgram Selector', () => {
  const fakeState = {
    edmHistogram: {
      ...initialState,
      loading: false,
      result: [
        {
          deviceId: 'ipsum',
          clazz2: 4480,
          clazz1: 4774,
          clazz0: 5204,
          clazz3: 820,
          channel: 'in occaecat tempor ullamco',
          timestamp: '2021-09-28T12:00:34.603Z',
          clazz4: 6287,
        },
      ],
      interval: {
        startDate: 123_456_789,
        endDate: 987_654_321,
      },
    },
  };

  describe('getEdmResult', () => {
    it('should return EDM Result', () => {
      expect(getEdmHistogramResult(fakeState)).toEqual(
        fakeState.edmHistogram.result
      );
    });
  });
  describe('getEdmHeatmapSeries', () => {
    it('should return EDM measurements', () => {
      expect(getEdmHeatmapSeries(fakeState)).toHaveProperty('xAxis');
    });
  });
});
