import { Action } from '@ngrx/store';

import {
  completeStep,
  setStepper,
} from '../../actions/settings/settings.actions';
import { initialState, reducer, settingsReducer } from './settings.reducer';

describe('Settings Reducer', () => {
  describe('Reducer function', () => {
    describe('on setStepper', () => {
      it('should set step', () => {
        const newStepperState = {
          ...initialState.stepper,
          currentStep: 2,
          previousStep: 1,
          nextStep: 3,
        };
        const action: Action = setStepper({ stepper: { ...newStepperState } });
        const state = settingsReducer(initialState, action);

        expect(state.stepper).toEqual(newStepperState);
      });
    });

    it('should return settingsReducer', () => {
      // prepare any action
      const action: Action = completeStep();
      expect(reducer(initialState, action)).toEqual(
        settingsReducer(initialState, action)
      );
    });
  });
});
