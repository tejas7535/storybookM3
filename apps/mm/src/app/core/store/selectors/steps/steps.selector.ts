import { createSelector } from '@ngrx/store';
import { StepsState } from '../../reducers/steps/steps.reducer';

export const getCurrentStep = (state: StepsState) => state.currentStep;

export const getBearingType = (state: StepsState) => state.bearingType;

export const getBearingSeries = (state: StepsState) => state.bearingSeries;

export const getBearingModel = (state: StepsState) => state.bearingModel;

export const getBearingSeat = (state: StepsState) => state.bearingSeat;

export const getMeasurementMethod = (state: StepsState) =>
  state.measurementMethod;

export const getMountingMethod = (state: StepsState) => state.mountingMethod;

export const getStepsURLParams = createSelector(
  getBearingType,
  getBearingSeries,
  getBearingModel,
  getBearingSeat,
  getMeasurementMethod,
  getMountingMethod,
  (
    bearingType: string,
    bearingSeries: string,
    bearingModel: string,
    bearingSeat: string,
    measurementMethod: string,
    mountingMethod: string
  ) => {
    const params = {
      bearingType,
      bearingSeries,
      bearingModel,
      bearingSeat,
      measurementMethod,
      mountingMethod,
    };

    return Object.entries(params)
      .map((pair) => pair.map(encodeURIComponent).join('='))
      .join('&');
  }
);
