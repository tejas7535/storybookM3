import { HttpStatusCode } from '@angular/common/http';

import { ReferenceType, ReferenceTypeIdentifier } from '@cdba/shared/models';
import { createAction, props, union } from '@ngrx/store';

export const selectReferenceType = createAction(
  '[Detail] Select Reference Type',
  props<{ referenceTypeIdentifier: ReferenceTypeIdentifier }>()
);

export const loadReferenceType = createAction('[Detail] Load Reference Type');

export const loadReferenceTypeSuccess = createAction(
  '[Detail] Load Reference Type Success',
  props<{ referenceType: ReferenceType }>()
);

export const loadReferenceTypeFailure = createAction(
  '[Detail] Load Reference Type Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

const all = union({
  selectReferenceType,
  loadReferenceType,
  loadReferenceTypeSuccess,
  loadReferenceTypeFailure,
});

export type ProductDetailsActions = typeof all;
