import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
  getLoadId,
} from '..';
import { LoadSenseAvg } from '../../reducers/load-sense/models';

describe('LoadSense Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = '123';
  });
  describe('Get LoadSense Actions', () => {
    test('getLoadId', () => {
      const action = getLoadId();

      expect(action).toEqual({
        type: '[Load Sense] Load Load Id',
      });
    });
    test('getBearingLoadLatest', () => {
      const action = getBearingLoadLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load',
      });
    });

    test('getLoadAverage', () => {
      const action = getLoadAverage({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load Average',
      });
    });

    test('getBearingLoadSuccess', () => {
      const bearingLoadLatest: any = {};
      const action = getBearingLoadSuccess({ bearingLoadLatest });

      expect(action).toEqual({
        bearingLoadLatest,
        type: '[Load Sense] Get Load Success',
      });
    });

    test('getLoadAverageSuccess', () => {
      const loadAverage: LoadSenseAvg = {
        deviceId: 'test-load-average',
        id: '123-test',
        lsp01StrainAvg: 1,
        lsp02StrainAvg: 2,
        lsp03StrainAvg: 3,
        lsp04StrainAvg: 4,
        lsp05StrainAvg: 5,
        lsp06StrainAvg: 6,
        lsp07StrainAvg: 7,
        lsp08StrainAvg: 8,
        lsp09StrainAvg: 9,
        lsp10StrainAvg: 10,
        lsp11StrainAvg: 11,
        lsp12StrainAvg: 12,
        lsp13StrainAvg: 13,
        lsp14StrainAvg: 14,
        lsp15StrainAvg: 15,
        lsp16StrainAvg: 16,
        timestamp: '00:00:00',
      };
      const action = getLoadAverageSuccess({ loadAverage });

      expect(action).toEqual({
        loadAverage,
        type: '[Load Sense] Get Load Average Success',
      });
    });

    test('getLoadAverageFailure', () => {
      const action = getLoadAverageFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Average Failure',
      });
    });

    test('getBearingLoadFailure', () => {
      const action = getBearingLoadFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Failure',
      });
    });
  });
});
