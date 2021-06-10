import { DATE_FORMAT } from '../../../../../app/shared/constants';
import { SHAFT_LATEST_GRAPH_DATA } from '../../../../../testing/mocks';
import { initialState, ShaftState } from '../../reducers/shaft/shaft.reducer';
import {
  getShaftLatestGraphData,
  getShaftLatestLoading,
  getShaftLatestResult,
  getShaftLatestTimeStamp,
  getShaftLoading,
  getShaftResult,
} from './shaft.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('Shaft Selector', () => {
  const fakeShaftState: ShaftState = {
    ...initialState,
    result: [
      {
        deviceId: 'fakedeviceid',
        timestamp: '2020-11-12T18:31:56.954003Z',
        rsm01ShaftSpeed: 3,
        rsm01Shaftcountervalue: 666,
      },
    ],
    loading: false,
    status: {
      result: {
        deviceId: 'fakedeviceid',
        timestamp: '2020-11-12T18:31:56.954003Z',
        rsm01ShaftSpeed: 3,
        rsm01Shaftcountervalue: 666,
      },
      loading: false,
    },
  };

  const fakeState = {
    shaft: fakeShaftState,
  };

  describe('getShaftLatestResult', () => {
    it('should return the latest shaft result', () => {
      expect(getShaftLatestResult(fakeState)).toEqual(
        fakeState.shaft.status.result
      );
    });
  });

  describe('getShaftLatestLoading', () => {
    it('should return the shaft result', () => {
      expect(getShaftLatestLoading(fakeState)).toEqual(
        fakeState.shaft.status.loading
      );
    });
  });

  describe('getShaftLatestTimeStamp', () => {
    it('should return the latest shaft result time stamp', () => {
      expect(getShaftLatestTimeStamp(fakeState)).toEqual(
        new Date(fakeShaftState.status.result.timestamp).toLocaleTimeString(
          DATE_FORMAT.local,
          DATE_FORMAT.options
        )
      );
    });
  });

  describe('getShaftLatestGraphData', () => {
    it('should return the latest shaft latest graph data', () => {
      expect(getShaftLatestGraphData(fakeState)).toEqual(
        SHAFT_LATEST_GRAPH_DATA
      );
    });
  });

  describe('getShaftResult', () => {
    it('should return the shaft result', () => {
      expect(getShaftResult(fakeState)).toEqual(fakeState.shaft.result);
    });
  });

  describe('getShaftLoading', () => {
    it('should return the shaft result', () => {
      expect(getShaftLoading(fakeState)).toEqual(fakeState.shaft.loading);
    });
  });
});
