import { createAction, props, union } from '@ngrx/store';

export const searchBearing = createAction(
  '[Bearing] Search Bearing',
  props<{ query: string }>()
);

export const bearingSearchSuccess = createAction(
  '[Bearing] Search Bearing Success',
  props<{ resultList: string[] }>()
);

export const selectBearing = createAction(
  '[Bearing] Select Bearing',
  props<{ bearing: string }>()
);

export const updateRouteParams = createAction('[Bearing] Update Route Params');

const all = union({
  searchBearing,
  bearingSearchSuccess,
  selectBearing,
  updateRouteParams,
});

export type BearingActions = typeof all;
