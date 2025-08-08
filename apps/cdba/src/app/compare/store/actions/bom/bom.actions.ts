import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import {
  BomIdentifier,
  BomItem,
  CostComponentSplit,
} from '@cdba/shared/models';

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

export const loadCostComponentSplit = createAction(
  '[Compare] Load Cost Component Split',
  props<{ bomIdentifier: BomIdentifier; index: number }>()
);

export const loadCostComponentSplitSuccess = createAction(
  '[Compare] Load Cost Component Split Success',
  props<{ items: CostComponentSplit[]; index: number }>()
);

export const loadCostComponentSplitFailure = createAction(
  '[Compare] Load Cost Component Split Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode; index: number }>()
);

export const toggleSplitType = createAction('[Compare] Toggle Split Type');

const all = union({
  loadBom,
  loadBomSuccess,
  loadBomFailure,
  selectBomItem,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  toggleSplitType,
});

export type BomActions = typeof all;
