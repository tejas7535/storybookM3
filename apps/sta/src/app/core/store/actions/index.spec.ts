import * as fromRootActions from './index';

describe('RootActions', () => {
  describe('Reset All Action', () => {
    test('ResetAll', () => {
      const action = fromRootActions.resetAll();

      expect(action).toEqual({
        type: '[All] Reset all',
      });
    });
  });
});
