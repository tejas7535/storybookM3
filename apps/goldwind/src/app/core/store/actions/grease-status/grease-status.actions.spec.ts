import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseDisplay,
  setGreaseInterval,
  stopGetGreaseStatusLatest,
} from '..';
import { GcmStatus } from '../../reducers/grease-status/models';

describe('GreaseStatus Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'test-device-id';
  });

  describe('Get GreaseStatus Actions', () => {
    test('getGreaseStatusId', () => {
      const source = 'fantasy-route';
      const action = getGreaseStatusId({ source });

      expect(action).toEqual({
        source,
        type: '[Grease Status] Load Grease Sensor ID',
      });
    });

    test('getGreaseStatus', () => {
      const action = getGreaseStatus({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Grease Status] Load Grease Status',
      });
    });

    test('getGreaseStatusSuccess', () => {
      const gcmStatus: GcmStatus = {
        GcmProcessed: [],
        RsmShafts: [],
      };
      const action = getGreaseStatusSuccess({ gcmStatus });

      expect(action).toEqual({
        gcmStatus,
        type: '[Grease Status] Load Grease Status Success',
      });
    });

    test('getGreaseStatusFailure', () => {
      const action = getGreaseStatusFailure();

      expect(action).toEqual({
        type: '[Grease Status] Load Grease Status Failure',
      });
    });

    test('getGreaseStatusLatest', () => {
      const action = getGreaseStatusLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Grease Status] Load Latest Grease Status',
      });
    });

    test('stopGetGreaseStatusLatest', () => {
      const action = stopGetGreaseStatusLatest();

      expect(action).toEqual({
        type: '[Grease Status] Stop Load Latest Grease Status',
      });
    });

    test('getGreaseStatusLatestSuccess', () => {
      const greaseStatusLatest: any = {};
      const action = getGreaseStatusLatestSuccess({ greaseStatusLatest });

      expect(action).toEqual({
        greaseStatusLatest,
        type: '[Grease Status] Load Latest Grease Status Success',
      });
    });

    test('getGreaseStatusLatestFailure', () => {
      const action = getGreaseStatusLatestFailure();

      expect(action).toEqual({
        type: '[Grease Status] Load Latest Grease Status Failure',
      });
    });

    test('setGreaseDisplay', () => {
      const greaseDisplay: any = {};
      const action = setGreaseDisplay({ greaseDisplay });

      expect(action).toEqual({
        greaseDisplay,
        type: '[Grease Status] Set Grease Display',
      });
    });

    test('setGreaseInterval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setGreaseInterval({ interval: mockInterval });

      expect(action).toEqual({
        interval: mockInterval,
        type: '[Grease Status] Set Interval',
      });
    });
  });
});
