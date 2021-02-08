import { DATE_FORMAT } from '../../../../../app/shared/constants';
import { SHAFT_LATEST_GRAPH_DATA } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getShaftLatestGraphData,
  getShaftResult,
  getShaftTimeStamp,
} from './shaft.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('Bearing Selector', () => {
  const fakeState = {
    shaft: {
      ...initialState,
      result: {
        id: 'fakeid',
        deviceId: 'fakedeviceid',
        timeStamp: '2020-11-12T18:31:56.954003Z',
        rsm01Shaftcountervalue: 666,
      },
      loading: false,
    },
  };

  describe('getShaftResult', () => {
    test('should return the shaft result', () => {
      expect(getShaftResult(fakeState)).toEqual(fakeState.shaft.result);
    });
  });

  describe('getShaftTimeStamp', () => {
    test('should return the shaft result time stamp', () => {
      expect(getShaftTimeStamp(fakeState)).toEqual(
        new Date(fakeState.shaft.result.timeStamp).toLocaleTimeString(
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
