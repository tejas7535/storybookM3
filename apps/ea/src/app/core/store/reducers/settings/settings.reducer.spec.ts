import { Action, createAction, props } from '@ngrx/store';

import { SettingsActions } from '../../actions';
import { SettingsState } from '../../models';
import { initialState, reducer, settingsReducer } from './settings.reducer';

describe('SettingsReducer', () => {
  describe('Reducer function', () => {
    it('should return settingsReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        settingsReducer(initialState, action)
      );
    });
  });

  describe('Standalone', () => {
    it('should set standalone', () => {
      const originalState: SettingsState = {
        ...initialState,
        isStandalone: true,
      };

      const newState = settingsReducer(
        originalState,
        SettingsActions.setStandalone({ isStandalone: false })
      );

      expect(newState).toEqual({
        ...initialState,
        isStandalone: false,
      });
    });
  });
  describe('PreviewSticky', () => {
    it('should set isPreviewSticky', () => {
      const originalState: SettingsState = {
        ...initialState,
        isResultPreviewSticky: false,
      };

      const newState = settingsReducer(
        originalState,
        SettingsActions.setResultPreviewSticky({ isResultPreviewSticky: true })
      );

      expect(newState).toEqual({
        ...initialState,
        isResultPreviewSticky: true,
      });
    });
  });
});
