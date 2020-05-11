import { createAction, props, union } from '@ngrx/store';

export const getReferenceTypeDetails = createAction(
  '[Detail] Load Reference Type Data'
);

export const getItem = createAction(
  '[Detail] Load Reference Type Item',
  props<{ referenceTypeId: any }>()
);

export const getItemSuccess = createAction(
  '[Detail] Load Reference Type Item Success',
  props<{ item: any }>()
);

export const getItemFailure = createAction(
  '[Detail] Load Reference Type Item Failure'
);

export const getBom = createAction(
  '[Detail] Load BOM',
  props<{ referenceTypeId: any }>()
);

export const getBomSuccess = createAction(
  '[Detail] Load BOM Success',
  props<{ items: any[] }>()
);

export const getBomFailure = createAction('[Detail] Load BOM Failure');

export const getCalculations = createAction(
  '[Detail] Load Calculations',
  props<{ referenceTypeId: any }>()
);

export const getCalculationsSuccess = createAction(
  '[Detail] Load Calculations Success',
  props<{ items: any[] }>()
);

export const getCalculationsFailure = createAction(
  '[Detail] Load Calculations Failure'
);

export const getDrawings = createAction(
  '[Detail] Load Drawings',
  props<{ referenceTypeId: any }>()
);

export const getDrawingsSuccess = createAction(
  '[Detail] Load Drawings Success',
  props<{ items: any[] }>()
);

export const getDrawingsFailure = createAction(
  '[Detail] Load Drawings Failure'
);

export const getRfqs = createAction(
  '[Detail] Load RFQs',
  props<{ referenceTypeId: any }>()
);

export const getRfqsSuccess = createAction(
  '[Detail] Load RFQs Success',
  props<{ items: any[] }>()
);

export const getRfqsFailure = createAction('[Detail] Load RFQs Failure');

const all = union({
  getReferenceTypeDetails,
  getItem,
  getItemSuccess,
  getItemFailure,
  getBom,
  getBomSuccess,
  getBomFailure,
  getCalculations,
  getCalculationsSuccess,
  getCalculationsFailure,
  getDrawings,
  getDrawingsSuccess,
  getDrawingsFailure,
  getRfqs,
  getRfqsSuccess,
  getRfqsFailure,
});

export type DetailActions = typeof all;
