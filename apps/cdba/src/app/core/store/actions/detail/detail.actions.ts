import { createAction, props, union } from '@ngrx/store';

import {
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';

export const getReferenceTypeDetails = createAction(
  '[Detail] Load Reference Type Data'
);

export const getReferenceTypeItem = createAction(
  '[Detail] Load Reference Type Item',
  props<{ referenceTypeId: ReferenceTypeIdModel }>()
);

export const getReferenceTypeItemSuccess = createAction(
  '[Detail] Load Reference Type Item Success',
  props<{ item: ReferenceTypeResultModel }>()
);

export const getReferenceTypeItemFailure = createAction(
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
  getBom,
  getRfqs,
  getDrawings,
  getBomSuccess,
  getBomFailure,
  getRfqsSuccess,
  getRfqsFailure,
  getCalculations,
  getDrawingsSuccess,
  getDrawingsFailure,
  getCalculationsSuccess,
  getCalculationsFailure,
  getReferenceTypeDetails,
  getItem: getReferenceTypeItem,
  getItemSuccess: getReferenceTypeItemSuccess,
  getItemFailure: getReferenceTypeItemFailure,
});

export type DetailActions = typeof all;
