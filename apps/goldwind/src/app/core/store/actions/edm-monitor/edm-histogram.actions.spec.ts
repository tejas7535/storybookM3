import { EdmHistogram } from '../../reducers/edm-monitor/edm-histogram.reducer';
import * as A from './edm-histogram.actions';

describe('EdmMonitor Actions', () => {
  const deviceId = 'my-device-test-id';
  const channel = 'edm-1';

  describe('Get EDM Histogram Actions', () => {
    it('getEdmHistogram', () => {
      const action = A.getEdmHistogram({ deviceId, channel });

      expect(action).toEqual({
        deviceId,
        channel,
        type: '[EDM Histogram] Load EDM Histogram',
      });
    });

    it('getEdmHistogramSuccess', () => {
      const histogram: EdmHistogram[] = [
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
      ];
      const action = A.getEdmHistogramSuccess({ histogram });

      expect(action).toEqual({
        histogram,
        type: '[EDM Histogram] Load EDM Success',
      });
    });

    it('getEdmHistogramFailure', () => {
      const action = A.getEdmHistogramFailure();

      expect(action).toEqual({
        type: '[EDM Histogram] Load EDM Failure',
      });
    });
  });
});
