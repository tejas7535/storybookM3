import { SHAFT_LATEST_GRAPH_DATA } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/bearing/bearing.reducer';
import {
  getBearingLoading,
  getBearingResult,
  getMainBearing,
  getShaftDeviceId,
  getShaftLatestGraphData,
  getShaftResult,
} from './bearing.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('Bearing Selector', () => {
  const fakeState = {
    bearing: {
      ...initialState,
      result: {
        title: 'BearingTitle',
        mainBearing: {
          model: 'BearingModel',
        },
      },
      loading: false,
      shaft: {
        result: {
          id: 'fakeid',
          deviceId: 'fakedeviceid',
          timeStamp: '2020-11-12T18:31:56.954003Z',
          rsm01Shaftcountervalue: 666,
        },
        loading: false,
      },
    },
  };

  describe('getBearingLoading', () => {
    test('should return loading status', () => {
      expect(getBearingLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getBearingResult', () => {
    test('should return a bearing', () => {
      expect(getBearingResult(fakeState)).toEqual(fakeState.bearing.result);
    });
  });

  describe('getMainBearing', () => {
    test('should return the main bearing', () => {
      expect(getMainBearing(fakeState)).toEqual(
        fakeState.bearing.result.mainBearing
      );
    });
  });

  describe('getShaftDeviceId', () => {
    test('should return the shaft result', () => {
      expect(getShaftDeviceId(fakeState)).toEqual('goldwind-qas-003');
    });
  });

  describe('getShaftResult', () => {
    test('should return the shaft result', () => {
      expect(getShaftResult(fakeState)).toEqual(fakeState.bearing.shaft.result);
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
