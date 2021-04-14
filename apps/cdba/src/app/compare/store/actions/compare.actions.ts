import { createAction, props, union } from '@ngrx/store';

import {
  BomItem,
  ReferenceTypeIdentifier,
} from '@cdba/core/store/reducers/detail/models';
import { Calculation } from '@cdba/core/store/reducers/shared/models';

export const selectReferenceTypes = createAction(
  '[Compare] Select Reference Types',
  props<{ referenceTypeIdentifiers: ReferenceTypeIdentifier[] }>()
);

export const loadCalculations = createAction('[Compare] Load Calculations');

export const loadCalculationHistory = createAction(
  '[Compare] Load Calculation History',
  props<{ materialNumber: string; index: number }>()
);

export const loadCalculationHistorySuccess = createAction(
  '[Compare] Load Calculation History Success',
  props<{ items: Calculation[]; index: number }>()
);

export const loadCalculationHistoryFailure = createAction(
  '[Compare] Load Calculation History Failure',
  props<{ error: Error; index: number }>()
);

export const selectCalculation = createAction(
  '[Compare] Select Calculation',
  props<{ nodeId: string; calculation: Calculation; index: number }>()
);

export const loadBom = createAction(
  '[Compare] Load BOM',
  props<{ index: number }>()
);

export const loadBomSuccess = createAction(
  '[Compare] Load BOM Success',
  props<{
    items: BomItem[];
    index: number;
  }>()
);

export const loadBomFailure = createAction(
  '[Compare] Load BOM Failure',
  props<{ error: Error; index: number }>()
);

export const selectBomItem = createAction(
  '[Compare] Select BOM Item',
  props<{ item: BomItem; index: number }>()
);

const all = union({
  selectReferenceTypes,
  loadCalculations,
  loadCalculationHistory,
  loadCalculationHistorySuccess,
  loadCalculationHistoryFailure,
  selectCalculation,
  loadBom,
  loadBomSuccess,
  loadBomFailure,
  selectBomItem,
});

export type CompareActions = typeof all;
