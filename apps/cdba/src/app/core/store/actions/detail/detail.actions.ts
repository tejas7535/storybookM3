import { createAction, props, union } from '@ngrx/store';

import {
  BomItem,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation, Drawing } from '../../reducers/shared/models';

export const selectReferenceType = createAction(
  '[Detail] Select Reference Type',
  props<{ referenceTypeIdentifier: ReferenceTypeIdentifier }>()
);

export const loadReferenceType = createAction('[Detail] Load Reference Type');

export const loadReferenceTypeSuccess = createAction(
  '[Detail] Load Reference Type Success',
  props<{ item: ReferenceTypeResultModel }>()
);

export const loadReferenceTypeFailure = createAction(
  '[Detail] Load Reference Type Failure',
  props<{ errorMessage: string }>()
);

export const loadBom = createAction('[Detail] Load BOM');

export const loadBomSuccess = createAction(
  '[Detail] Load BOM Success',
  props<{ items: BomItem[] }>()
);

export const loadBomFailure = createAction(
  '[Detail] Load BOM Failure',
  props<{ errorMessage: string }>()
);

export const selectBomItem = createAction(
  '[Detail] Select BOM Item',
  props<{ item: BomItem }>()
);

export const loadCalculations = createAction('[Detail] Load Calculations');

export const loadCalculationsSuccess = createAction(
  '[Detail] Load Calculations Success',
  props<{ items: Calculation[] }>()
);

export const loadCalculationsFailure = createAction(
  '[Detail] Load Calculations Failure',
  props<{ errorMessage: string }>()
);

export const selectCalculation = createAction(
  '[Detail] Select Calculation',
  props<{ nodeId: string; calculation: Calculation }>()
);

export const selectDrawing = createAction(
  '[Detail] Select Drawing',
  props<{ nodeId: string; drawing: Drawing }>()
);

export const loadDrawings = createAction('[Detail] Load Drawings');

export const loadDrawingsSuccess = createAction(
  '[Detail] Load Drawings Success',
  props<{ items: any[] }>()
);

export const loadDrawingsFailure = createAction(
  '[Detail] Load Drawings Failure',
  props<{ errorMessage: string }>()
);

export const loadRfqs = createAction(
  '[Detail] Load RFQs',
  props<{ referenceTypeId: any }>()
);

export const loadRfqsSuccess = createAction(
  '[Detail] Load RFQs Success',
  props<{ items: any[] }>()
);

export const loadRfqsFailure = createAction(
  '[Detail] Load RFQs Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  selectReferenceType,
  loadBom,
  loadBomSuccess,
  loadBomFailure,
  selectBomItem,
  selectDrawing,
  loadDrawings,
  loadDrawingsSuccess,
  loadDrawingsFailure,
  loadRfqs,
  loadRfqsSuccess,
  loadRfqsFailure,
  loadCalculations,
  loadCalculationsSuccess,
  loadCalculationsFailure,
  selectCalculation,
  loadReferenceType,
  loadReferenceTypeSuccess,
  loadReferenceTypeFailure,
});

export type DetailActions = typeof all;
