import { Action, createReducer, on } from '@ngrx/store';
import {
  setBearingType,
  setBearingSeries,
  setStep,
  setBearingSeat,
  setBearingModel,
  setMeasurementMethod,
  setMountingMethod,
} from '../../actions/steps/steps.action';
import { StepName } from './steps.enum';

export interface StepsState {
  currentStep: StepName;
  bearingType: string;
  bearingSeries: string;
  bearingModel: string;
  bearingSeat: string;
  measurementMethod: string;
  mountingMethod: string;
}

export const initialState: StepsState = {
  currentStep: StepName.Bearing,
  bearingType: undefined,
  bearingSeries: undefined,
  bearingModel: undefined,
  bearingSeat: undefined,
  measurementMethod: undefined,
  mountingMethod: undefined,
};

export const stepsReducer = createReducer(
  initialState,
  on(setStep, (state: StepsState, { currentStep }) => ({
    ...state,
    currentStep,
  })),
  on(setBearingType, (state: StepsState, { bearingType }) => ({
    ...state,
    bearingType,
  })),
  on(setBearingSeries, (state: StepsState, { bearingSeries }) => ({
    ...state,
    bearingSeries,
  })),
  on(setBearingModel, (state: StepsState, { bearingModel }) => ({
    ...state,
    bearingModel,
  })),
  on(setBearingSeat, (state: StepsState, { bearingSeat }) => ({
    ...state,
    bearingSeat,
  })),
  on(setMeasurementMethod, (state: StepsState, { measurementMethod }) => ({
    ...state,
    measurementMethod,
  })),
  on(setMountingMethod, (state: StepsState, { mountingMethod }) => ({
    ...state,
    mountingMethod,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: StepsState, action: Action): StepsState {
  return stepsReducer(state, action);
}
