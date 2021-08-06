import { createAction, props, union } from '@ngrx/store';

export const searchBearing = createAction(
  '[Bearing] Search Bearing',
  props<{ query: string }>()
);

const all = union({
  searchBearing,
});

export type BearingActions = typeof all;
