import { CenterLoadStatus } from '../../../../shared/models';
import {
  getCenterLoad,
  getCenterLoadFailure,
  getCenterLoadSuccess,
} from './center-load.actions';

describe('CenterLoad Actions', () => {
  describe('Action: getCenterLoad', () => {
    it('should have Property deviceId', () => {
      const action = getCenterLoad({ deviceId: 'foo' });
      expect(action.deviceId).toEqual('foo');
    });
  });

  describe('getCenterLoadSuccess', () => {
    it('should contain action with', () => {
      const action = getCenterLoadSuccess({
        centerLoad: [{ deviceId: 'foo' }] as CenterLoadStatus[],
      });
      expect(action.centerLoad).toStrictEqual([{ deviceId: 'foo' }]);
    });
  });
  describe('getCenterLoadFailure', () => {
    it('should can be triggered', () => {
      const action = getCenterLoadFailure();
      expect(action).toBeTruthy();
    });
  });
});
