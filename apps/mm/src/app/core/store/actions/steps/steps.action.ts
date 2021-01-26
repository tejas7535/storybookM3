import { createAction, props, union } from '@ngrx/store';
import { StepName } from '../../reducers/steps/steps.enum';

export const setStep = createAction(
  '[Steps] Set Step',
  props<{ currentStep: StepName }>()
);

export const setBearingType = createAction(
  '[Steps] Set Bearing Type',
  props<{ bearingType: string }>()
);

export const setBearingSeries = createAction(
  '[Steps] Set Bearing Series',
  props<{ bearingSeries: string }>()
);

export const setBearingModel = createAction(
  '[Steps] Set Bearing Model',
  props<{ bearingModel: string }>()
);

export const setBearingSeat = createAction(
  '[Steps] Set Bearing Seat',
  props<{ bearingSeat: string }>()
);

export const setMeasurementMethod = createAction(
  '[Steps] Set Measurement Method',
  props<{ measurementMethod: string }>()
);

export const setMountingMethod = createAction(
  '[Steps] Set Mounting Method',
  props<{ mountingMethod: string }>()
);

const all = union({
  setStep,
  setBearingType,
  setBearingSeries,
  setBearingModel,
  setBearingSeat,
  setMeasurementMethod,
  setMountingMethod,
});

export type StepsActions = typeof all;
