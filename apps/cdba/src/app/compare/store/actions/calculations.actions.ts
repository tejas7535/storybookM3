import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import { Calculation, ExcludedCalculations } from '@cdba/shared/models';

export const loadCalculations = createAction('[Compare] Load Calculations');

export const loadCalculationHistory = createAction(
  '[Compare] Load Calculation History',
  props<{ materialNumber: string; plant: string; index: number }>()
);

export const loadCalculationHistorySuccess = createAction(
  '[Compare] Load Calculation History Success',
  props<{
    items: Calculation[];
    excludedItems: ExcludedCalculations;
    plant: string;
    index: number;
  }>()
);

export const loadCalculationHistoryFailure = createAction(
  '[Compare] Load Calculation History Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode; index: number }>()
);

export const selectCalculation = createAction(
  '[Compare] Select Calculation',
  props<{ nodeId: string; calculation: Calculation; index: number }>()
);

const all = union({
  loadCalculations,
  loadCalculationHistory,
  loadCalculationHistorySuccess,
  loadCalculationHistoryFailure,
  selectCalculation,
});

export type CalculationsActions = typeof all;
