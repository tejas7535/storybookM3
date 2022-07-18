import {
  setAppDelivery,
  setCurrentStep,
} from '../../actions/settings/settings.actions';
import { initialState, reducer } from './settings.reducer';

describe('Settings Reducer', () => {
  it('should set app delivery', () => {
    const state = reducer(
      initialState,
      setAppDelivery({ appDelivery: 'embedded' })
    );

    expect(state.environment.appDelivery).toEqual('embedded');
  });

  it('should set current step', () => {
    const newStep = 2;
    const state = reducer(initialState, setCurrentStep({ step: newStep }));

    expect(state.stepper.currentStep).toEqual(newStep);
  });
});
