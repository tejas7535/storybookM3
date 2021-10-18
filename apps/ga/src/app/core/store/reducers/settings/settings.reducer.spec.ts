import { Action } from '@ngrx/store';

import {
  setCurrentStep,
  setLanguage,
} from '../../actions/settings/settings.actions';
import { initialState, reducer, settingsReducer } from './settings.reducer';

describe('Settings Reducer', () => {
  describe('Reducer function', () => {
    describe('on setStepper', () => {
      it('should set step', () => {
        const newStep = 2;
        const action: Action = setCurrentStep({ step: newStep });
        const state = settingsReducer(initialState, action);

        expect(state.stepper.currentStep).toEqual(newStep);
      });
    });

    describe('on set language', () => {
      it('should set the language', () => {
        const action: Action = setLanguage({ language: 'language' });
        const state = settingsReducer(initialState, action);

        expect(state.language).toEqual('language');
      });
    });

    it('should return settingsReducer', () => {
      // prepare any action
      const action: Action = setCurrentStep({ step: 2 });
      expect(reducer(initialState, action)).toEqual(
        settingsReducer(initialState, action)
      );
    });
  });
});
