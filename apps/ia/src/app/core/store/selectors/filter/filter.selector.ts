import { translate } from '@jsverse/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import moment from 'moment';

import {
  DATA_IMPORT_DAY,
  DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS,
} from '../../../../shared/constants';
import {
  EmployeesRequest,
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  RouterStateUrl,
  selectFilterState,
  selectRouterState,
} from '../../reducers';
import {
  FilterState,
  selectAllSelectedFilters,
} from '../../reducers/filter/filter.reducer';

export const getSelectedDimension = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedDimension
);

export const getBenchmarkDimension = createSelector(
  selectFilterState,
  (state: FilterState) => state.benchmarkDimension
);

export const getMomentTimeRangeConstraints = createSelector(
  selectFilterState,
  (state: FilterState) => ({
    min: state.timeRangeConstraints?.min
      ? moment.unix(state.timeRangeConstraints.min).utc()
      : undefined,
    max: state.timeRangeConstraints?.max
      ? moment.unix(state.timeRangeConstraints.max).utc()
      : undefined,
  })
);

export const getSelectedDimensionFilter = createSelector(
  selectFilterState,
  getSelectedDimension,
  (state: FilterState, selectedDimension: FilterDimension) =>
    state.data[selectedDimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === selectedDimension
          )?.[1],
          state.data[selectedDimension].items
        )
      : undefined
);

export const getBenchmarkDimensionFilter = createSelector(
  selectFilterState,
  getBenchmarkDimension,
  (state: FilterState, benchmarkDimension: FilterDimension) =>
    state.data[benchmarkDimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === benchmarkDimension
          )?.[1],
          state.data[benchmarkDimension].items
        )
      : undefined
);

export const getSpecificDimensonFilter = (dimension: FilterDimension) =>
  createSelector(selectFilterState, (state: FilterState) =>
    state.data[dimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === dimension
          )?.[1],
          state.data[dimension].items
        )
      : undefined
  );

export const getSelectedDimensionDataLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data[state.selectedDimension]?.loading
);

export const getBenchmarkDimensionDataLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data[state.benchmarkDimension]?.loading
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => state?.state.url
);

export const getTimePeriods = createSelector(
  selectFilterState,
  (state: FilterState) =>
    state.timePeriods.map(
      (period) =>
        new IdValue(
          period.id,
          translate(`filters.periodOfTime.${period.value}`)
        )
    )
);

export const getSelectedTimePeriod = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedTimePeriod
);

export const getSelectedFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedFilters
);

export const getBenchmarkFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.benchmarkFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedFilters
);

export const getAllBenchmarkFilters = createSelector(
  getBenchmarkFilters,
  selectAllSelectedFilters
);

export const getCurrentFilters = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (
    filters: SelectedFilter[],
    selectedDimension: FilterDimension
  ): EmployeesRequest => {
    const selectedFilters = filters.filter(
      (filter) =>
        filter.name === selectedDimension ||
        filter.name === FilterKey.TIME_RANGE
    );

    return {
      filterDimension: selectedDimension,
      value: selectedFilters.find((filter) => filter.name === selectedDimension)
        ?.idValue.id,
      timeRange: selectedFilters.find(
        (filter) => filter.name === FilterKey.TIME_RANGE
      )?.idValue.id,
    };
  }
);

export const getAreAllFiltersSelected = createSelector(
  getCurrentFilters,
  (currentFilters: {
    filterDimension: FilterDimension;
    value: string;
    timeRange: string;
  }): boolean =>
    !!(
      currentFilters.filterDimension &&
      currentFilters.value &&
      currentFilters.timeRange
    )
);

export const getCurrentBenchmarkFilters = createSelector(
  getAllBenchmarkFilters,
  getBenchmarkDimension,
  (
    benchmarkFilters: SelectedFilter[],
    selectedDimension: FilterDimension
  ): EmployeesRequest => {
    const selectedFilters = benchmarkFilters.filter(
      (filter) =>
        filter.name === selectedDimension ||
        filter.name === FilterKey.TIME_RANGE
    );

    return {
      filterDimension: selectedDimension,
      value: selectedFilters.find((filter) => filter.name === selectedDimension)
        ?.idValue.id,
      timeRange: selectedFilters.find(
        (filter) => filter.name === FilterKey.TIME_RANGE
      )?.idValue.id,
    };
  }
);

export const getCurrentDimensionValue = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) => {
    const selectedFilters = filters.filter(
      (filter) => filter.name === selectedDimension
    );

    const selectedDimensionFilter = selectedFilters.find(
      (filter) => filter.name === selectedDimension
    );

    return selectedDimension === FilterDimension.ORG_UNIT
      ? selectedDimensionFilter?.idValue.value.replaceAll(/\s+\(.*?\)$/g, '')
      : selectedDimensionFilter?.idValue.value;
  }
);

export const getSelectedDimensionIdValue = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) =>
    filters.find((filter) => filter.name === selectedDimension)?.idValue
);

export const getBenchmarkIdValue = createSelector(
  getAllBenchmarkFilters,
  getBenchmarkDimension,
  (filters: SelectedFilter[], benchmarkDimension: FilterDimension) =>
    filters.find((filter) => filter.name === benchmarkDimension)?.idValue
);

export const getSelectedDimensionValue = createSelector(
  getSelectedDimensionIdValue,
  (val: IdValue) => val?.value
);

export const getSelectedBenchmarkValue = createSelector(
  getBenchmarkIdValue,
  (val: IdValue) => val?.value
);

export const getSelectedTimeRange = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.TIME_RANGE)?.idValue
);

export const getSelectedMomentTimeRange = createSelector(
  getSelectedTimeRange,
  (timeRange: IdValue) => {
    if (timeRange.id === undefined) {
      return {
        from: undefined,
        to: undefined,
      };
    }
    const timeRangeSplit = timeRange.id.split('|');

    return {
      from: moment.unix(+timeRangeSplit[0]).utc(),
      to: moment.unix(+timeRangeSplit[1]).utc(),
    };
  }
);

export const getTimeRangeForAllAvailableData = createSelector(
  getSelectedDimension,
  (dimension: FilterDimension) => {
    const nowDate = moment()
      .utc()
      .subtract(DATA_IMPORT_DAY - 1, 'day') // use previous month if data is not imported yet
      .endOf('month');

    const end = nowDate.clone().endOf('year').utc();
    const start =
      dimension === FilterDimension.ORG_UNIT
        ? moment.utc({ year: 2021, month: 0, day: 1 })
        : moment.utc({ year: 2022, month: 0, day: 1 });

    return `${start.unix()}|${end.unix()}`;
  }
);

export const getLast6MonthsTimeRange = createSelector(
  getSelectedTimeRange,
  (timeRange: IdValue) => {
    const end = moment.unix(+timeRange.id.split('|')[1]).utc().endOf('month');
    const start = end.clone().subtract(5, 'months').startOf('month');

    return `${start.unix()}|${end.unix()}`;
  }
);

export const getBeautifiedFilterValues = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  getSelectedTimePeriod,
  (
    filters: SelectedFilter[],
    selectedDimension: string,
    timePeriod: TimePeriod
  ) => {
    let timeframe: string;
    const timeRange = filters
      .find((filter) => filter.name === FilterKey.TIME_RANGE)
      ?.idValue.id?.split('|');

    const timeRangeStart = moment.unix(+timeRange[0]).utc();
    const timeRangeEnd = moment.unix(+timeRange[1]).utc();

    switch (timePeriod) {
      case TimePeriod.LAST_12_MONTHS: {
        timeframe = `${timeRangeStart.format('MMMM YYYY')} - ${timeRangeEnd.format('MMMM YYYY')}`;

        break;
      }
      case TimePeriod.MONTH: {
        timeframe = timeRangeEnd.format('MMMM YYYY');

        break;
      }
      case TimePeriod.YEAR: {
        timeframe = timeRangeEnd.format('YYYY');

        break;
      }
      default: {
        break;
      }
    }

    return selectedDimension
      ? {
          timeRange: timeframe,
          filterDimension: translate(
            `filters.dimension.availableDimensions.${selectedDimension}`
          ),
          value: filters.find((filter) => filter.name === selectedDimension)
            ?.idValue.value,
        }
      : undefined;
  }
);

export const getAreOpenApplicationsAvailable = createSelector(
  getSelectedDimension,
  (selectedDimension: FilterDimension) =>
    !DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS.includes(selectedDimension)
);

export const getFiltersAsFileName = (title: string) =>
  createSelector(
    getAllSelectedFilters,
    getSelectedDimension,
    (filters: SelectedFilter[], selectedDimension: FilterDimension) => {
      const value = filters.find((filter) => filter.name === selectedDimension)
        .idValue.value;
      const timeRange = filters.find(
        (filter) => filter.name === FilterKey.TIME_RANGE
      ).idValue.value;

      return `${title} ${value} ${timeRange}`;
    }
  );
