import { CenterLoadStatus } from '../../../../shared/models';
import { KPIState } from '../../../../shared/store/utils.selector';
import {
  getCenterLoadLoading,
  getCenterLoadResult,
} from './center-load.selector';

describe('CenterLoad Selector', () => {
  const mockState: KPIState<CenterLoadStatus> = {
    loading: false,
    result: [{ deviceId: 'foo' }] as CenterLoadStatus[],
    status: {
      loading: false,
      result: { deviceId: 'bar' } as CenterLoadStatus,
    },
  };

  describe('getCenterLoadLoading', () => {
    it('should return loading latest status', () => {
      expect(getCenterLoadLoading({ 'center-load': mockState })).toBeFalsy();
    });
  });
  describe('getCenterLoadResult', () => {
    it('should return loading latest status', () => {
      expect(getCenterLoadResult({ 'center-load': mockState })).toStrictEqual([
        { deviceId: 'foo' },
      ]);
    });
  });
});
