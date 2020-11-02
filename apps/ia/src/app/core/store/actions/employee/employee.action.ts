import { createAction, props, union } from '@ngrx/store';

import { Filter, InitialFiltersResponse } from '../../../../shared/models';

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

const all = union({
  loadInitialFilters,
  loadInitialFiltersSuccess,
  loadInitialFiltersFailure,
  filterSelected,
});

export type SearchActions = typeof all;
