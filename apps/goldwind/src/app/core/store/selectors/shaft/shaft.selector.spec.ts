import { DATE_FORMAT } from '../../../../../app/shared/constants';
import { SHAFT_LATEST_GRAPH_DATA } from '../../../../../testing/mocks';
import { initialState, ShaftState } from '../../reducers/shaft/shaft.reducer';
import {
  getShaftLatestGraphData,
  getShaftResult,
  getShaftTimeStamp,
} from './shaft.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('Shaft Selector', () => {
  const fakeShaftState: ShaftState = {
    ...initialState,
    result: {
      deviceId: 'fakedeviceid',
      timestamp: '2020-11-12T18:31:56.954003Z',
      rsm01ShaftSpeed: 3,
      rsm01Shaftcountervalue: 666,
    },
    loading: false,
  };

  const fakeState = {
    shaft: fakeShaftState,
  };

  describe('getShaftResult', () => {
    test('should return the shaft result', () => {
      expect(getShaftResult(fakeState)).toEqual(fakeState.shaft.result);
    });
  });

  describe('getShaftTimeStamp', () => {
    test('should return the shaft result time stamp', () => {
      expect(getShaftTimeStamp(fakeState)).toEqual(
        new Date(fakeShaftState.result.timestamp).toLocaleTimeString(
          DATE_FORMAT.local,
          DATE_FORMAT.options
        )
      );
    });
  });

  describe('getShaftLatestGraphData', () => {
    test('should return the shaft latest graph data', () => {
      expect(getShaftLatestGraphData(fakeState)).toEqual(
        SHAFT_LATEST_GRAPH_DATA
      );
    });
  });
});
