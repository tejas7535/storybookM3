import { createAction, props, union } from '@ngrx/store';

import {
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';

export const loadFilterBenchmarkDimensionData = createAction(
  '[Filter] Load Filter Benchmark Dimension Data',
  props<{ filterDimension: FilterDimension; searchFor?: string }>()
);

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
  props<{ filterDimension: FilterDimension; errorMessage: string }>()
);

export const filterSelected = createAction(
  '[Filter] Filter selected',
  props<{ filter: SelectedFilter }>()
);

export const benchmarkFilterSelected = createAction(
  '[Filter] Benchmark Filter selected',
  props<{ filter: SelectedFilter }>()
);

export const filterDimensionSelected = createAction(
  '[Filter] Filter dimension selected',
  props<{ filterDimension: FilterDimension; filter: SelectedFilter }>()
);

export const timePeriodSelected = createAction(
  '[Filter] Time period selected',
  props<{ timePeriod: TimePeriod }>()
);

export const timeRangeSelected = createAction(
  '[Filter] Time range selected',
  props<{ timeRange: SelectedFilter }>()
);

export const dimensionSelected = createAction('[Filter] Dimension Selected');

export const benchmarDimensionSelected = createAction(
  '[Filter] Benchmark Dimension Selected'
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
