import { createAction, props, union } from '@ngrx/store';

import {
  Filter,
  InitialFiltersResponse,
  TimePeriod,
} from '../../../../shared/models';

export const loadInitialFilters = createAction(
  '[Employee] Load Initial Filters'
);

export const loadInitialFiltersSuccess = createAction(
  '[Employee] Load Initial Filters Success',
  props<{ filters: InitialFiltersResponse }>()
);

export const loadInitialFiltersFailure = createAction(
  '[Employee] Load Initial Filters Failure',
  props<{ errorMessage: string }>()
);

export const filterSelected = createAction(
  '[Employee] Filter selected',
  props<{ filter: Filter }>()
);

export const timePeriodSelected = createAction(
  '[Employee] Time period selected',
  props<{ timePeriod: TimePeriod }>()
);

export const timeRangeSelected = createAction(
  '[Employee] Time range selected',
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
