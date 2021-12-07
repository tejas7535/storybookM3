import { GcmStatus } from '../../reducers/grease-status/models';
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
        type: '[GreaseStatus] Load Grease Sensor ID',
      });
    });

    it('getGreaseStatus', () => {
      const action = getGreaseStatus({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[GreaseStatus] Load GreaseStatus',
      });
    });

    it('getGreaseStatusSuccess', () => {
      const gcmStatus = [{} as GcmStatus];
      const action = getGreaseStatusSuccess({ gcmStatus });

      expect(action).toEqual({
        gcmStatus,
        type: '[GreaseStatus] Load GreaseStatus Success',
      });
    });

    it('getGreaseStatusFailure', () => {
      const action = getGreaseStatusFailure();

      expect(action).toEqual({
        type: '[GreaseStatus] Load GreaseStatus Failure',
      });
    });

    it('getGreaseStatusLatest', () => {
      const action = getGreaseStatusLatest({ deviceId });

      expect(action).toEqual({
        deviceId,
        type: '[GreaseStatus] Load Latest GreaseStatus',
      });
    });

    it('stopGetGreaseStatusLatest', () => {
      const action = stopGetGreaseStatusLatest();

      expect(action).toEqual({
        type: '[GreaseStatus] Stop Load Latest GreaseStatus',
      });
    });

    it('getGreaseStatusLatestSuccess', () => {
      const greaseStatusLatest: any = {};
      const action = getGreaseStatusLatestSuccess({ greaseStatusLatest });

      expect(action).toEqual({
        greaseStatusLatest,
        type: '[GreaseStatus] Load Latest GreaseStatus Success',
      });
    });

    it('getGreaseStatusLatestFailure', () => {
      const action = getGreaseStatusLatestFailure();

      expect(action).toEqual({
        type: '[GreaseStatus] Load Latest GreaseStatus Failure',
      });
    });
  });
});
