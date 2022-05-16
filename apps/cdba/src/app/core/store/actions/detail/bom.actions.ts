import { HttpStatusCode } from '@angular/common/http';

import {
  BomIdentifier,
  BomItem,
  CostComponentSplit,
  OdataBomIdentifier,
} from '@cdba/shared/models';
import { createAction, props, union } from '@ngrx/store';

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
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

export const selectBomItem = createAction(
  '[Detail] Select BOM Item',
  props<{ item: BomItem }>()
);

export const loadCostComponentSplit = createAction(
  '[Detail] Load Cost Component Split',
  props<{ bomIdentifier: OdataBomIdentifier }>()
);

export const loadCostComponentSplitSuccess = createAction(
  '[Detail] Load Cost Component Split Success',
  props<{ items: CostComponentSplit[] }>()
);

export const loadCostComponentSplitFailure = createAction(
  '[Detail] Load Cost Component Split Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

export const toggleSplitType = createAction('[Detail] Toggle Split Type');

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
