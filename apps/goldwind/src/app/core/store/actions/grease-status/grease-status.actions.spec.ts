import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusId,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  stopGetGreaseStatusLatest,
} from '..';
import { GcmStatus } from '../../reducers/grease-status/models';

describe('GreaseStatus Actions', () => {
  let deviceId: string;

  beforeEach(() => {
    deviceId = 'test-device-id';
  });

  describe('Get GreaseStatus Actions', () => {
    it('getGreaseStatusId', () => {
      const source = 'fantasy-route';
      const action = getGreaseStatusId({ source });

      expect(action).toEqual({
        source,
        type: '[Grease Status] Load Grease Sensor ID',
      });
    });

    it('getGreaseStatus', () => {
      const action = getGreaseStatus({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Grease Status] Load Grease Status',
      });
    });

    it('getGreaseStatusSuccess', () => {
      const gcmStatus = [{} as GcmStatus];
      const action = getGreaseStatusSuccess({ gcmStatus });

      expect(action).toEqual({
        gcmStatus,
        type: '[Grease Status] Load Grease Status Success',
      });
    });

    it('getGreaseStatusFailure', () => {
      const action = getGreaseStatusFailure();

      expect(action).toEqual({
        type: '[Grease Status] Load Grease Status Failure',
      });
    });

    it('getGreaseStatusLatest', () => {
      const action = getGreaseStatusLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[Grease Status] Load Latest Grease Status',
      });
    });

    it('stopGetGreaseStatusLatest', () => {
      const action = stopGetGreaseStatusLatest();

      expect(action).toEqual({
        type: '[Grease Status] Stop Load Latest Grease Status',
      });
    });

    it('getGreaseStatusLatestSuccess', () => {
      const greaseStatusLatest: any = {};
      const action = getGreaseStatusLatestSuccess({ greaseStatusLatest });

      expect(action).toEqual({
        greaseStatusLatest,
        type: '[Grease Status] Load Latest Grease Status Success',
      });
    });

    it('getGreaseStatusLatestFailure', () => {
      const action = getGreaseStatusLatestFailure();

      expect(action).toEqual({
        type: '[Grease Status] Load Latest Grease Status Failure',
      });
    });
  });
});
