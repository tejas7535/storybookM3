import {
  DATE_FORMAT,
  STATIC_STAFETY_SETTINGS,
} from '../../../../shared/constants';
import { initialState } from '../../reducers/shaft/shaft.reducer';
import { StaticSafetyState } from '../../reducers/static-safety/static-safety.reducer';
import {
  getStaticSafetyLatestGraphData,
  getStaticSafetyLatestLoading,
  getStaticSafetyLatestResult,
  getStaticSafetyLatestTimeStamp,
  getStaticSafetyLoading,
} from './static-safety.selector';

describe('Static Safety Selector', () => {
  const staticSafetyState: StaticSafetyState = {
    ...initialState,
    loading: false,
    status: {
      result: {
        deviceId: 'fakedeviceid',
        staticSafetyFactor: 21,
        timestamp: new Date().toISOString(),
      },
      loading: false,
    },
  };

  const fakeState = {
    staticSafety: staticSafetyState,
  };

  describe('getStaticSafetyLatestResult', () => {
    it('should return the latest result', () => {
      expect(getStaticSafetyLatestResult(fakeState)).toEqual(
        fakeState.staticSafety.status.result
      );
    });
  });

  describe('getStaticSafetyLatestTimeStamp', () => {
    it('should return the latest result', () => {
      expect(getStaticSafetyLatestTimeStamp(fakeState)).toEqual(
        new Date(
          fakeState.staticSafety.status.result.timestamp
        ).toLocaleTimeString(DATE_FORMAT.local, DATE_FORMAT.options)
      );
    });
  });
  describe('getStaticSafetyLoading', () => {
    it('should return the latest result', () => {
      expect(getStaticSafetyLoading(fakeState)).toEqual(
        fakeState.staticSafety.loading
      );
    });
  });
  describe('getStaticSafetyLatestLoading', () => {
    it('should return the latest result', () => {
      expect(getStaticSafetyLatestLoading(fakeState)).toEqual(
        fakeState.staticSafety.loading
      );
    });
  });
  describe('getStaticSafetyLatestGraphData', () => {
    it('should return the latest result', () => {
      const graphState = getStaticSafetyLatestGraphData(fakeState);
      expect(graphState.series).toHaveLength(
        STATIC_STAFETY_SETTINGS.THRESHOLD_CONFIG.length + 2
      );
    });
  });
});
