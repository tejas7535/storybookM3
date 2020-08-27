import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusId,
  getGreaseStatusSuccess,
  setGreaseDisplay,
} from '..';

describe('GreaseStatus Actions', () => {
  let greaseStatusId: string;

  beforeEach(() => {
    greaseStatusId = 'grease-fat-oil';
  });

  describe('Get GreaseStatus Actions', () => {
    test('getGreaseStatusId', () => {
      const action = getGreaseStatusId();

      expect(action).toEqual({
        type: '[Grease Status] Load Grease Sensor ID',
      });
    });

    test('getGreaseStatus', () => {
      const action = getGreaseStatus({ greaseStatusId });

      expect(action).toEqual({
        greaseStatusId,
        type: '[Grease Status] Load Grease Status',
      });
    });

    test('getGreaseStatusSuccess', () => {
      const greaseStatus: any = {};
      const action = getGreaseStatusSuccess({ greaseStatus });

      expect(action).toEqual({
        greaseStatus,
        type: '[Grease Status] Load Grease Status Success',
      });
    });

    test('getGreaseStatusFailure', () => {
      const action = getGreaseStatusFailure();

      expect(action).toEqual({
        type: '[Grease Status] Load Grease Status Failure',
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
  });
});
