import { AppDelivery } from '@mm/shared/models';

import { GlobalActions } from '../../actions/global/global.actions';
import { GlobalState } from '../../models/global-state.model';
import { globalReducer } from './global.reducer';

describe('Global Reducer', () => {
  const initialState: GlobalState = {
    isStandalone: true,
    appDelivery: AppDelivery.Standalone,
    initialized: false,
    isInternalUser: false,
  };

  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = globalReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  describe('initGlobal', () => {
    it('should set initialized to true', () => {
      const action = GlobalActions.setIsInitialized();
      const state = globalReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        initialized: true,
      });
    });
  });

  describe('setIsStandalone', () => {
    it('should set isStandalone to false', () => {
      const action = GlobalActions.setIsStandalone({ isStandalone: false });
      const state = globalReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isStandalone: false,
      });
    });
  });

  describe('setAppDelivery', () => {
    it('should set appDelivery to Embedded', () => {
      const action = GlobalActions.setAppDelivery({
        appDelivery: AppDelivery.Embedded,
      });
      const state = globalReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        appDelivery: AppDelivery.Embedded,
      });
    });
  });

  describe('setIsInternalUser', () => {
    it('should set isInternalUser to true', () => {
      const action = GlobalActions.setIsInternalUser({ isInternalUser: true });
      const state = globalReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isInternalUser: true,
      });
    });
  });
});
