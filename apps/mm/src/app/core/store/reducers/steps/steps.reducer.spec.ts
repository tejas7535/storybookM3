import {
  setBearingModel,
  setBearingSeat,
  setBearingSeries,
  setBearingType,
  setMeasurementMethod,
  setMountingMethod,
  setStep,
} from '../../actions/steps/steps.action';
import { StepName } from './steps.enum';
import { initialState, reducer, stepsReducer } from './steps.reducer';

describe('Steps Reducer', () => {
  it('should set the current step', () => {
    const step = StepName.CalculationOptions;
    const action = setStep({ currentStep: step });
    const state = stepsReducer(initialState, action);

    expect(state.currentStep).toEqual(step);
  });

  it('should set the bearing type', () => {
    const bearingType = 'some bearing type';
    const action = setBearingType({ bearingType });
    const state = stepsReducer(initialState, action);

    expect(state.bearingType).toEqual(bearingType);
  });

  it('should set the bearing series', () => {
    const bearingSeries = 'some bearing series';
    const action = setBearingSeries({ bearingSeries });
    const state = stepsReducer(initialState, action);

    expect(state.bearingSeries).toEqual(bearingSeries);
  });

  it('should set the bearing model', () => {
    const bearingModel = 'some bearing model';
    const action = setBearingModel({ bearingModel });
    const state = stepsReducer(initialState, action);

    expect(state.bearingModel).toEqual(bearingModel);
  });

  it('should set the bearing seat', () => {
    const bearingSeat = 'some bearing seat';
    const action = setBearingSeat({ bearingSeat });
    const state = stepsReducer(initialState, action);

    expect(state.bearingSeat).toEqual(bearingSeat);
  });

  it('should set measurement method', () => {
    const measurementMethod = 'some bearing seat';
    const action = setMeasurementMethod({
      measurementMethod,
    });
    const state = stepsReducer(initialState, action);

    expect(state.measurementMethod).toEqual(measurementMethod);
  });

  it('should set mounting method', () => {
    const mountingMethod = 'some bearing seat';
    const action = setMountingMethod({
      mountingMethod,
    });
    const state = stepsReducer(initialState, action);

    expect(state.mountingMethod).toEqual(mountingMethod);
  });

  it('should return stepsReducer', () => {
    const action = setMeasurementMethod({ measurementMethod: 'some method' });
    expect(reducer(initialState, action)).toEqual(
      stepsReducer(initialState, action)
    );
  });
});
