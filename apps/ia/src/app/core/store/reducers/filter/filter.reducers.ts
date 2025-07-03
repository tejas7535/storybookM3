import moment from 'moment';

import { DIMENSIONS_WITH_2021_DATA } from '../../../../shared/constants';
import {
  filterAdapter,
  FilterDimension,
  FilterKey,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import { getBeautifiedTimeRange } from '../../../../shared/utils/utilities';
import {
  getMaxTimeRangeConstraint,
  getMinTimeRangeConstraint,
  getTimeRangeConstraints,
  getTimeRangeFilterForTimePeriod,
} from './filter.helpers';
import { FilterState } from './filter.reducer';

/**
 * Reset time range filter reducer
 */
export function resetTimeRangeFilterReducer(
  state: FilterState,
  initialTimeRange: string
): FilterState {
  return {
    ...state,
    selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
    selectedFilters: filterAdapter.upsertOne(
      new SelectedFilter(FilterKey.TIME_RANGE, {
        id: initialTimeRange,
        value: getBeautifiedTimeRange(initialTimeRange),
      }),
      state.selectedFilters
    ),
    benchmarkFilters: filterAdapter.upsertOne(
      new SelectedFilter(FilterKey.TIME_RANGE, {
        id: initialTimeRange,
        value: getBeautifiedTimeRange(initialTimeRange),
      }),
      state.benchmarkFilters
    ),
    timeRangeConstraints: getTimeRangeConstraints(state.selectedDimension, {
      min: getMinTimeRangeConstraint(state.selectedDimension),
      max: getMaxTimeRangeConstraint(TimePeriod.LAST_12_MONTHS),
    }),
  };
}

/**
 * Load filter benchmark dimension data reducer
 */
export function loadFilterBenchmarkDimensionDataReducer(
  state: FilterState,
  { filterDimension }: { filterDimension: FilterDimension }
): FilterState {
  return {
    ...state,
    data: {
      ...state.data,
      [filterDimension]: {
        ...state.data[filterDimension],
        loading: true,
      },
    },
    benchmarkDimension: filterDimension,
  };
}

/**
 * Load filter dimension data reducer
 */
export function loadFilterDimensionDataReducer(
  state: FilterState,
  { filterDimension }: { filterDimension: FilterDimension }
): FilterState {
  const shouldResetTimeRange =
    !DIMENSIONS_WITH_2021_DATA.includes(filterDimension) &&
    +state.selectedFilters.entities[FilterKey.TIME_RANGE].idValue?.id?.split(
      '|'
    )[0] < moment.utc('2023-01-01').unix();

  return {
    ...state,
    data: {
      ...state.data,
      [filterDimension]: {
        ...state.data[filterDimension],
        loading: true,
      },
    },
    selectedDimension: filterDimension,
    timeRangeConstraints: getTimeRangeConstraints(
      filterDimension,
      state.timeRangeConstraints
    ),
    selectedFilters: shouldResetTimeRange
      ? filterAdapter.upsertOne(
          {
            idValue: { id: undefined, value: undefined },
            name: FilterKey.TIME_RANGE,
          },
          state.selectedFilters
        )
      : filterAdapter.upsertOne(
          state.selectedFilters.entities[FilterKey.TIME_RANGE],
          state.selectedFilters
        ),
  };
}

/**
 * Load filter dimension data success reducer
 */
export function loadFilterDimensionDataSuccessReducer(
  state: FilterState,
  { filterDimension, items }: { filterDimension: FilterDimension; items: any[] }
): FilterState {
  return {
    ...state,
    data: {
      ...state.data,
      [filterDimension]: {
        ...state.data[filterDimension],
        loading: false,
        items,
      },
    },
  };
}

/**
 * Load filter dimension data failure reducer
 */
export function loadFilterDimensionDataFailureReducer(
  state: FilterState,
  {
    filterDimension,
    errorMessage,
  }: { filterDimension: FilterDimension; errorMessage: string }
): FilterState {
  return {
    ...state,
    data: {
      ...state.data,
      [filterDimension]: {
        ...state.data[filterDimension],
        errorMessage,
        loading: false,
      },
    },
  };
}

/**
 * Filter selected reducer
 */
export function filterSelectedReducer(
  state: FilterState,
  { filter }: { filter: SelectedFilter }
): FilterState {
  return {
    ...state,
    selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
    selectedDimension:
      Object.values(FilterDimension).find((d) => d === filter.name) ??
      state.selectedDimension,
    // There is only one time range filter for now. It makes changes for both filter collections.
    // So, when time range filter changes, make updates in benchmark filters too.
    benchmarkFilters:
      filter.name === FilterKey.TIME_RANGE
        ? filterAdapter.upsertOne(filter, state.benchmarkFilters)
        : state.benchmarkFilters,
  };
}

/**
 * Benchmark filter selected reducer
 */
export function benchmarkFilterSelectedReducer(
  state: FilterState,
  { filter }: { filter: SelectedFilter }
): FilterState {
  return {
    ...state,
    benchmarkFilters: filterAdapter.upsertOne(filter, state.benchmarkFilters),
  };
}

/**
 * Filter dimension selected reducer
 */
export function filterDimensionSelectedReducer(
  state: FilterState,
  {
    filterDimension,
    filter,
  }: { filterDimension: FilterDimension; filter: SelectedFilter }
): FilterState {
  return {
    ...state,
    selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
    selectedDimension: filterDimension,
  };
}

/**
 * Time period selected reducer
 */
export function timePeriodSelectedReducer(
  state: FilterState,
  { timePeriod }: { timePeriod: TimePeriod }
): FilterState {
  return {
    ...state,
    selectedTimePeriod: timePeriod,
    selectedFilters: getTimeRangeFilterForTimePeriod(
      timePeriod,
      state.selectedFilters
    ),
    benchmarkFilters: getTimeRangeFilterForTimePeriod(
      timePeriod,
      state.benchmarkFilters
    ),
    timeRangeConstraints: {
      ...state.timeRangeConstraints,
      max: getMaxTimeRangeConstraint(timePeriod),
    },
  };
}

/**
 * Activate time period filters reducer
 */
export function activateTimePeriodFiltersReducer(
  state: FilterState,
  {
    timePeriods,
    activeTimePeriod,
    timeRange,
    timeRangeConstraints,
  }: {
    timePeriods: any[];
    activeTimePeriod: TimePeriod;
    timeRange: any;
    timeRangeConstraints: any;
  }
): FilterState {
  return {
    ...state,
    timePeriods,
    selectedTimePeriod: activeTimePeriod,
    selectedFilters: filterAdapter.upsertOne(
      new SelectedFilter(FilterKey.TIME_RANGE, timeRange),
      state.selectedFilters
    ),
    benchmarkFilters: filterAdapter.upsertOne(
      new SelectedFilter(FilterKey.TIME_RANGE, timeRange),
      state.benchmarkFilters
    ),
    timeRangeConstraints,
  };
}

/**
 * Set available time periods reducer
 */
export function setAvailableTimePeriodsReducer(
  state: FilterState,
  { timePeriods }: { timePeriods: any[] }
): FilterState {
  return {
    ...state,
    timePeriods,
  };
}
