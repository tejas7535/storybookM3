import { HttpStatusCode } from '@angular/common/http';

import {
  BomIdentifier,
  BomItem,
  Calculation,
  ExcludedCalculations,
  ReferenceType,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { createAction, props, union } from '@ngrx/store';

export const selectCompareItems = createAction(
  '[Compare] Select Compare Items',
  props<{
    items: [nodeId: string, referenceTypeIdentifier: ReferenceTypeIdentifier][];
  }>()
);

export const loadAllProductDetails = createAction(
  '[Compare] Load All Product Details'
);

export const loadProductDetails = createAction(
  '[Compare] Load Product Details',
  props<{ referenceTypeIdentifier: ReferenceTypeIdentifier; index: number }>()
);

export const loadProductDetailsSuccess = createAction(
  '[Compare] Load Product Details Success',
  props<{ item: ReferenceType; index: number }>()
);

export const loadProductDetailsFailure = createAction(
  '[Compare] Load Product Details Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode; index: number }>()
);

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

export const loadBom = createAction(
  '[Compare] Load BOM',
  props<{ index: number; bomIdentifier: BomIdentifier }>()
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
  props<{ errorMessage: string; statusCode: HttpStatusCode; index: number }>()
);

export const selectBomItem = createAction(
  '[Compare] Select BOM Item',
  props<{ item: BomItem; index: number }>()
);

const all = union({
  selectCompareItems,
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsSuccess,
  loadProductDetailsFailure,
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
