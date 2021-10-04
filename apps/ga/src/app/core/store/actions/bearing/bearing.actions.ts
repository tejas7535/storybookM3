import { createAction, props, union } from '@ngrx/store';

export const searchBearing = createAction(
  '[Bearing] Search Bearing',
  props<{ query: string }>()
);

export const bearingSearchSuccess = createAction(
  '[Bearing] Search Bearing Success',
  props<{ resultList: string[] }>()
);

// todo bearingSearchFailure

export const modelCreateSuccess = createAction(
  '[Bearing] Model Create Success',
  props<{ modelId: string }>()
);

export const modelCreateFailure = createAction(
  '[Bearing] Model Create Failure'
);

export const selectBearing = createAction(
  '[Bearing] Select Bearing',
  props<{ bearing: string }>()
);

const all = union({
  searchBearing,
  bearingSearchSuccess,
  selectBearing,
  modelCreateSuccess,
  modelCreateFailure,
});

export type BearingActions = typeof all;
