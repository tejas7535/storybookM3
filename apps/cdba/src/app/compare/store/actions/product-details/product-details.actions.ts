import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import { ReferenceType, ReferenceTypeIdentifier } from '@cdba/shared/models';

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

const all = union({
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsSuccess,
  loadProductDetailsFailure,
});

export type ProductDetailsActions = typeof all;
