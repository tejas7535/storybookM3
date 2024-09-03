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

export const autocompleteBenchmarkDimensionData = createAction(
  '[Filter] Trigger Benchmark Dimension Autocomplete',
  props<{ filterDimension: FilterDimension; searchFor: string }>()
);

export const loadFilterDimensionData = createAction(
  '[Filter] Load Filter Dimension Data',
  props<{ filterDimension: FilterDimension; searchFor?: string }>()
);

export const autocompleteDimensionData = createAction(
  '[Filter] Trigger Dimension Autocomplete',
  props<{ filterDimension: FilterDimension; searchFor: string }>()
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

export const dimensionSelected = createAction('[Filter] Dimension Selected');

export const benchmarDimensionSelected = createAction(
  '[Filter] Benchmark Dimension Selected'
);

export const triggerLoad = createAction('[Filter] Trigger Load');

export const activateTimePeriodFilters = createAction(
  '[Filter] Activate Time Period Filters',
  props<{
    timePeriods: IdValue[];
    activeTimePeriod: TimePeriod;
    timeRange: IdValue;
    timeRangeConstraints: {
      min: number;
      max: number;
    };
  }>()
);

export const setAvailableTimePeriods = createAction(
  '[Filter] Set Available Time Periods',
  props<{ timePeriods: IdValue[] }>()
);

const all = union({
  loadFilterDimensionData,
  loadFilterDimensionDataSuccess,
  loadFilterDimensionDataFailure,
  filterSelected,
  timePeriodSelected,
  triggerLoad,
});

export type FilterActions = typeof all;
