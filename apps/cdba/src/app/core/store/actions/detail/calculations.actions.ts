import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import {
  Calculation,
  ExcludedCalculations,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

export const loadCalculations = createAction('[Detail] Load Calculations');

export const loadCalculationsSuccess = createAction(
  '[Detail] Load Calculations Success',
  props<{
    calculations: Calculation[];
    excludedCalculations: ExcludedCalculations;
    referenceTypeIdentifier?: ReferenceTypeIdentifier;
  }>()
);

export const loadCalculationsFailure = createAction(
  '[Detail] Load Calculations Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

export const selectCalculation = createAction(
  '[Detail] Select Calculation',
  props<{ nodeId: string; calculation: Calculation }>()
);

export const selectCalculations = createAction(
  '[Detail] Select Calculations',
  props<{ nodeIds: string[] }>()
);

const all = union({
  loadCalculations,
  loadCalculationsSuccess,
  loadCalculationsFailure,
  selectCalculation,
  selectCalculations,
});

export type CalculationsActions = typeof all;
