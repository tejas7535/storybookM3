import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
  getLoadId,
} from '..';
import { LoadSense } from '../../reducers/load-sense/models';

describe('LoadSense Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = '123';
  });
  describe('Get LoadSense Actions', () => {
    it('getLoadId', () => {
      const action = getLoadId();

      expect(action).toEqual({
        type: '[Load Sense] Load Load Id',
      });
    });
    it('getBearingLoadLatest', () => {
      const action = getBearingLoadLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load',
      });
    });

    it('getLoadAverage', () => {
      const action = getLoadAverage({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load Average',
      });
    });

    it('getBearingLoadSuccess', () => {
      const bearingLoadLatest: any = {};
      const action = getBearingLoadSuccess({ bearingLoadLatest });

      expect(action).toEqual({
        bearingLoadLatest,
        type: '[Load Sense] Get Load Success',
      });
    });

    it('getLoadAverageSuccess', () => {
      const loadAverage: LoadSense = {
        deviceId: 'test-load-average',
        id: '123-test',
        lsp01Strain: 1,
        lsp02Strain: 2,
        lsp03Strain: 3,
        lsp04Strain: 4,
        lsp05Strain: 5,
        lsp06Strain: 6,
        lsp07Strain: 7,
        lsp08Strain: 8,
        lsp09Strain: 9,
        lsp10Strain: 10,
        lsp11Strain: 11,
        lsp12Strain: 12,
        lsp13Strain: 13,
        lsp14Strain: 14,
        lsp15Strain: 15,
        lsp16Strain: 16,
        timestamp: '00:00:00',
      };
      const action = getLoadAverageSuccess({ loadAverage });

      expect(action).toEqual({
        loadAverage,
        type: '[Load Sense] Get Load Average Success',
      });
    });

    it('getLoadAverageFailure', () => {
      const action = getLoadAverageFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Average Failure',
      });
    });

    it('getBearingLoadFailure', () => {
      const action = getBearingLoadFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Failure',
      });
    });
  });
});
