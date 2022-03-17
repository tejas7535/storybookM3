import { createAction, props, union } from '@ngrx/store';

import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';

export const loadOrgUnits = createAction(
  '[Filter] Load Org Units',
  props<{ searchFor: string }>()
);

export const loadOrgUnitsSuccess = createAction(
  '[Filter] Load Org Units Success',
  props<{ items: IdValue[] }>()
);

export const loadOrgUnitsFailure = createAction(
  '[Filter] Load Org Units Failure',
  props<{ errorMessage: string }>()
);

export const filterSelected = createAction(
  '[Filter] Filter selected',
  props<{ filter: SelectedFilter }>()
);

export const timePeriodSelected = createAction(
  '[Filter] Time period selected',
  props<{ timePeriod: TimePeriod }>()
);

export const timeRangeSelected = createAction(
  '[Filter] Time range selected',
  props<{ timeRange: string }>()
);

export const triggerLoad = createAction('[Filter] Trigger Load');

const all = union({
  loadOrgUnits,
  loadOrgUnitsSuccess,
  loadOrgUnitsFailure,
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
  triggerLoad,
});

export type FilterActions = typeof all;
