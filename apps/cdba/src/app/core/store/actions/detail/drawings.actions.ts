import { HttpStatusCode } from '@angular/common/http';

import { createAction, props, union } from '@ngrx/store';

import { Drawing } from '@cdba/shared/models';

export const selectDrawing = createAction(
  '[Detail] Select Drawing',
  props<{ nodeId: string; drawing: Drawing }>()
);

export const loadDrawings = createAction('[Detail] Load Drawings');

export const loadDrawingsSuccess = createAction(
  '[Detail] Load Drawings Success',
  props<{ items: Drawing[] }>()
);

export const loadDrawingsFailure = createAction(
  '[Detail] Load Drawings Failure',
  props<{ errorMessage: string; statusCode: HttpStatusCode }>()
);

const all = union({
  selectDrawing,
  loadDrawings,
  loadDrawingsSuccess,
  loadDrawingsFailure,
});

export type DrawingsActions = typeof all;
