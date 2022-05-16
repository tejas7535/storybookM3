import { HttpStatusCode } from '@angular/common/http';

import { ReferenceType, ReferenceTypeIdentifier } from '@cdba/shared/models';
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

const all = union({
  selectCompareItems,
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsSuccess,
  loadProductDetailsFailure,
});

export type ProductDetailsActions = typeof all;
