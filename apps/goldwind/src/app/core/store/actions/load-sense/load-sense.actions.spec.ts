import { LOAD_SENSE } from '../../../../../testing/mocks';
import { LoadSense } from '../../reducers/load-sense/models';
import {
  getBearingLoad,
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
  getLoadId,
} from '..';

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
        type: '[Load Sense] Get Load Latest',
      });
    });

    it('getLoadAverage', () => {
      const action = getLoadAverage({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load Average',
      });
    });

    it('getBearingLoad', () => {
      const action = getBearingLoad({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Load Sense] Get Load',
      });
    });

    it('getBearingLoadLatestSuccess', () => {
      const bearingLoadLatest: any = {};
      const action = getBearingLoadLatestSuccess({ bearingLoadLatest });

      expect(action).toEqual({
        bearingLoadLatest,
        type: '[Load Sense] Get Load Latest Success',
      });
    });

    it('getLoadAverageSuccess', () => {
      const loadAverage: LoadSense = LOAD_SENSE;
      const action = getLoadAverageSuccess({ loadAverage });

      expect(action).toEqual({
        loadAverage,
        type: '[Load Sense] Get Load Average Success',
      });
    });

    it('getBearingLoadSuccess', () => {
      const bearingLoad: any = {};
      const action = getBearingLoadSuccess({ bearingLoad });

      expect(action).toEqual({
        bearingLoad,
        type: '[Load Sense] Get Load Success',
      });
    });

    it('getLoadAverageFailure', () => {
      const action = getLoadAverageFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Average Failure',
      });
    });

    it('getBearingLoadLatestFailure', () => {
      const action = getBearingLoadLatestFailure();

      expect(action).toEqual({
        type: '[Load Sense] Get Load Latest Failure',
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
