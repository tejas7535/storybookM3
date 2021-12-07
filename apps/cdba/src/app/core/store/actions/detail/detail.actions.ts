import {
  BomIdentifier,
  BomItem,
  Calculation,
  Drawing,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { createAction, props, union } from '@ngrx/store';

import { ReferenceTypeResult } from '../../reducers/detail/models';

export const selectReferenceType = createAction(
  '[Detail] Select Reference Type',
  props<{ referenceTypeIdentifier: ReferenceTypeIdentifier }>()
);

export const loadReferenceType = createAction('[Detail] Load Reference Type');

export const loadReferenceTypeSuccess = createAction(
  '[Detail] Load Reference Type Success',
  props<{ item: ReferenceTypeResult }>()
);

export const loadReferenceTypeFailure = createAction(
  '[Detail] Load Reference Type Failure',
  props<{ error: string }>()
);

export const loadBom = createAction(
  '[Detail] Load BOM',
  props<{ bomIdentifier: BomIdentifier }>()
);

export const loadBomSuccess = createAction(
  '[Detail] Load BOM Success',
  props<{ items: BomItem[] }>()
);

export const loadBomFailure = createAction(
  '[Detail] Load BOM Failure',
  props<{ error: string }>()
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
  props<{ error: string }>()
);

export const selectCalculation = createAction(
  '[Detail] Select Calculation',
  props<{ nodeId: string; calculation: Calculation }>()
);

export const selectCalculations = createAction(
  '[Detail] Select Calculations',
  props<{ nodeIds: string[] }>()
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
  props<{ error: string }>()
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
  loadCalculations,
  loadCalculationsSuccess,
  loadCalculationsFailure,
  selectCalculation,
  selectCalculations,
  loadReferenceType,
  loadReferenceTypeSuccess,
  loadReferenceTypeFailure,
});

export type DetailActions = typeof all;
