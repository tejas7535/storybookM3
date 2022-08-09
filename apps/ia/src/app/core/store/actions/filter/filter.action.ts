import { createAction, props, union } from '@ngrx/store';

import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import { FilterDimension as FilterDimension } from '../../reducers/filter/filter.reducer';

export const loadFilterDimensionData = createAction(
  '[Filter] Load Filter Dimension Data',
  props<{ filterDimension: FilterDimension; searchFor?: string }>()
);

export const loadFilterDimensionDataSuccess = createAction(
  '[Filter] Load Filter Dimension Data Success',
  props<{ filterDimension: FilterDimension; items: IdValue[] }>()
);

export const loadFilterDimensionDataFailure = createAction(
  '[Filter] Load Filter Dimension Data Failure',
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

export const triggerLoad = createAction('[Filter] Trigger Load');

const all = union({
  loadFilterDimensionData,
  loadFilterDimensionDataSuccess,
  loadFilterDimensionDataFailure,
  filterSelected,
  timePeriodSelected,
  triggerLoad,
});

export type FilterActions = typeof all;
