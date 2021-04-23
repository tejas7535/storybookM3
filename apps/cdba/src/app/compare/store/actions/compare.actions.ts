import { createAction, props, union } from '@ngrx/store';

import {
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

export const selectCompareItems = createAction(
  '[Compare] Select Compare Items',
  props<{
    items: [nodeId: string, referenceTypeIdentifier: ReferenceTypeIdentifier][];
  }>()
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
  props<{ errorMessage: string; index: number }>()
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
  props<{ errorMessage: string; index: number }>()
);

export const selectBomItem = createAction(
  '[Compare] Select BOM Item',
  props<{ item: BomItem; index: number }>()
);

const all = union({
  selectCompareItems,
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
