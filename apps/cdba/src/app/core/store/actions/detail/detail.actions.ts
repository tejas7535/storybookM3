import { createAction, props, union } from '@ngrx/store';

import {
  BomIdentifier,
  BomItem,
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';

export const loadReferenceTypeDetails = createAction(
  '[Detail] Load Reference Type Data'
);

export const loadReferenceType = createAction(
  '[Detail] Load Reference Type',
  props<{ referenceTypeId: ReferenceTypeIdModel }>()
);

export const loadReferenceTypeSuccess = createAction(
  '[Detail] Load Reference Type Success',
  props<{ item: ReferenceTypeResultModel }>()
);

export const loadReferenceTypeFailure = createAction(
  '[Detail] Load Reference Type Failure'
);

export const loadBom = createAction(
  '[Detail] Load BOM',
  props<{ bomIdentifier: BomIdentifier }>()
);

export const loadBomSuccess = createAction(
  '[Detail] Load BOM Success',
  props<{ items: BomItem[] }>()
);

export const loadBomFailure = createAction('[Detail] Load BOM Failure');

export const loadCalculations = createAction(
  '[Detail] Load Calculations',
  props<{ materialNumber: string }>()
);

export const loadCalculationsSuccess = createAction(
  '[Detail] Load Calculations Success',
  props<{ items: Calculation[] }>()
);

export const loadCalculationsFailure = createAction(
  '[Detail] Load Calculations Failure'
);

export const loadDrawings = createAction(
  '[Detail] Load Drawings',
  props<{ referenceTypeId: any }>()
);

export const loadDrawingsSuccess = createAction(
  '[Detail] Load Drawings Success',
  props<{ items: any[] }>()
);

export const loadDrawingsFailure = createAction(
  '[Detail] Load Drawings Failure'
);

export const loadRfqs = createAction(
  '[Detail] Load RFQs',
  props<{ referenceTypeId: any }>()
);

export const loadRfqsSuccess = createAction(
  '[Detail] Load RFQs Success',
  props<{ items: any[] }>()
);

export const loadRfqsFailure = createAction('[Detail] Load RFQs Failure');

const all = union({
  loadBom,
  loadBomSuccess,
  loadBomFailure,
  loadDrawings,
  loadDrawingsSuccess,
  loadDrawingsFailure,
  loadRfqs,
  loadRfqsSuccess,
  loadRfqsFailure,
  loadCalculations,
  loadCalculationsSuccess,
  loadCalculationsFailure,
  loadReferenceTypeDetails,
  loadReferenceType,
  loadReferenceTypeSuccess,
  loadReferenceTypeFailure,
});

export type DetailActions = typeof all;
