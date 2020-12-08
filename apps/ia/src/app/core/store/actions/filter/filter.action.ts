import { createAction, props, union } from '@ngrx/store';

import {
  InitialFiltersResponse,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';

export const loadInitialFilters = createAction('[Filter] Load Initial Filters');

export const loadInitialFiltersSuccess = createAction(
  '[Filter] Load Initial Filters Success',
  props<{ filters: InitialFiltersResponse }>()
);

export const loadInitialFiltersFailure = createAction(
  '[Filter] Load Initial Filters Failure',
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

const all = union({
  loadInitialFilters,
  loadInitialFiltersSuccess,
  loadInitialFiltersFailure,
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
});

export type SearchActions = typeof all;
