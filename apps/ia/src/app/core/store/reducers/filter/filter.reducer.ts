import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import moment, { Moment } from 'moment';

import {
  DATA_IMPORT_DAY,
  DATE_FORMAT_BEAUTY,
  DIMENSIONS_WITH_2021_DATA,
} from '../../../../shared/constants';
import {
  filterAdapter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../../../shared/utils/utilities';
import {
  benchmarkFilterSelected,
  filterDimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  timePeriodSelected,
} from '../../actions/filter/filter.action';

export const filterKey = 'filter';

export interface FilterData {
  loading: boolean;
  items: IdValue[];
  errorMessage: string;
}

export interface FilterState {
  data: Record<FilterDimension, FilterData>;
  timePeriods: IdValue[];
  selectedFilters: EntityState<SelectedFilter>; // currently selected filters
  benchmarkFilters: EntityState<SelectedFilter>; // currently selected benchmark filters
  selectedTimePeriod: TimePeriod;
  selectedDimension: FilterDimension;
  benchmarkDimension: FilterDimension;
  timeRangeConstraints: {
    min: number;
    max: number;
  };
}

export function getMaxDate() {
  const maxDate: Moment = moment()
    .utc()
    .subtract(DATA_IMPORT_DAY, 'days') // use previous month if data is not imported yet
    .subtract(1, 'month')
    .endOf('month');

  return maxDate.unix();
}

export const getInitialSelectedTimeRange = (today: Moment) => {
  // use month before to prevent wrong calculations for the future
  const nowDate = today
    .clone()
    .utc()
    .subtract(DATA_IMPORT_DAY, 'days') // use previous month if data is not imported yet
    .subtract(1, 'month')
    .endOf('month');
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

export const initialTimeRange = getInitialSelectedTimeRange(moment.utc());

export const initialState: FilterState = {
  data: {
    // eslint-disable-next-line unicorn/no-array-reduce
    ...Object.values(FilterDimension).reduce(
      (map, curr) => (
        (map[curr] = {
          loading: false,
          items: [],
          errorMessage: undefined,
          // eslint-disable-next-line no-sequences
        }),
        map
      ),
      {} as any
    ),
  },
  timePeriods: [
    {
      id: TimePeriod.YEAR,
      value: TimePeriod.YEAR,
    },
    {
      id: TimePeriod.MONTH,
      value: TimePeriod.MONTH,
    },
    {
      id: TimePeriod.LAST_12_MONTHS,
      value: TimePeriod.LAST_12_MONTHS,
    },
  ],
  selectedFilters: filterAdapter.getInitialState({
    ids: [FilterKey.TIME_RANGE],
    entities: {
      [FilterKey.TIME_RANGE]: {
        name: FilterKey.TIME_RANGE,
        idValue: {
          id: initialTimeRange,
          value: getBeautifiedTimeRange(initialTimeRange),
        },
      },
    },
  }),
  benchmarkFilters: filterAdapter.getInitialState({
    ids: [FilterKey.TIME_RANGE, FilterDimension.ORG_UNIT],
    entities: {
      [FilterKey.TIME_RANGE]: {
        name: FilterKey.TIME_RANGE,
        idValue: {
          id: initialTimeRange,
          value: getBeautifiedTimeRange(initialTimeRange),
        },
      },
      [FilterDimension.ORG_UNIT]: {
        name: FilterDimension.ORG_UNIT,
        idValue: {
          id: '50008377',
          value: 'Schaeffler',
        },
      },
    },
  }),
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
  selectedDimension: undefined,
  benchmarkDimension: FilterDimension.ORG_UNIT,
  timeRangeConstraints: {
    min: undefined,
    max: getMaxDate(),
  },
};

export const filterReducer = createReducer(
  initialState,
  on(
    loadFilterBenchmarkDimensionData,
    (state: FilterState, { filterDimension }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: true,
        },
      },
      benchmarkDimension: filterDimension,
    })
  ),
  on(
    loadFilterDimensionData,
    (state: FilterState, { filterDimension }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: true,
        },
      },
      selectedDimension: filterDimension,
      timeRangeConstraints: {
        ...state.timeRangeConstraints,
        min: DIMENSIONS_WITH_2021_DATA.includes(filterDimension)
          ? moment.utc('2022-01-01').unix()
          : moment.utc('2023-01-01').unix(),
      },
      selectedFilters:
        !DIMENSIONS_WITH_2021_DATA.includes(filterDimension) &&
        +state.selectedFilters.entities[
          FilterKey.TIME_RANGE
        ].idValue?.id?.split('|')[0] < moment.utc('2023-01-01').unix()
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
    })
  ),
  on(
    loadFilterDimensionDataSuccess,
    (state: FilterState, { filterDimension, items }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: false,
          items,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state: FilterState, { filterDimension, errorMessage }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    filterSelected,
    (state: FilterState, { filter }): FilterState => ({
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
    })
  ),
  on(
    benchmarkFilterSelected,
    (state: FilterState, { filter }): FilterState => ({
      ...state,
      benchmarkFilters: filterAdapter.upsertOne(filter, state.benchmarkFilters),
    })
  ),
  on(
    filterDimensionSelected,
    (state: FilterState, { filterDimension, filter }): FilterState => ({
      ...state,
      selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
      selectedDimension: filterDimension,
    })
  ),
  on(
    timePeriodSelected,
    (state: FilterState, { timePeriod }): FilterState => ({
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
        max:
          timePeriod === TimePeriod.YEAR
            ? moment
                .unix(getMaxDate())
                .utc()
                .subtract(1, 'year')
                .endOf('year')
                .unix()
            : getMaxDate(),
      },
    })
  )
);

export const getTimeRangeFilterForTimePeriod = (
  timePeriod: TimePeriod,
  entityState: EntityState<SelectedFilter>
): EntityState<SelectedFilter> => {
  const currentTimeRangeEnd = moment
    .unix(+entityState.entities[FilterKey.TIME_RANGE].idValue.id.split('|')[1])
    .utc();

  switch (timePeriod) {
    case TimePeriod.YEAR: {
      const currentDate = moment.utc().subtract(DATA_IMPORT_DAY, 'days');
      const timeRangeStart =
        currentTimeRangeEnd.year() === currentDate.year()
          ? currentTimeRangeEnd
              .clone()
              .utc()
              .subtract(1, 'year')
              .startOf('year')
          : currentTimeRangeEnd.clone().utc().startOf('year');
      const timeRangeEnd = timeRangeStart.clone().utc().endOf('year');

      return filterAdapter.upsertOne(
        {
          idValue: {
            id: `${timeRangeStart.unix()}|${timeRangeEnd.unix()}`,
            value: `${timeRangeEnd.utc().format('YYYY')}`,
          },
          name: FilterKey.TIME_RANGE,
        },
        entityState
      );
    }
    case TimePeriod.MONTH: {
      const timeRangeStart = currentTimeRangeEnd.clone().utc().startOf('month');
      const timeRangeEnd = currentTimeRangeEnd.clone().utc().endOf('month');

      return filterAdapter.upsertOne(
        {
          idValue: {
            id: `${timeRangeStart.utc().unix()}|${timeRangeEnd.utc().unix()}`,
            value: timeRangeStart.utc().format(DATE_FORMAT_BEAUTY),
          },
          name: FilterKey.TIME_RANGE,
        },
        entityState
      );
    }
    case TimePeriod.LAST_12_MONTHS: {
      const timeRangeStart = getMonth12MonthsAgo(currentTimeRangeEnd);
      const timeRangeEnd = currentTimeRangeEnd.clone().utc().endOf('month');

      return filterAdapter.upsertOne(
        {
          idValue: {
            id: `${timeRangeStart.utc().unix()}|${timeRangeEnd.utc().unix()}`,
            value: `${timeRangeStart.utc().format(DATE_FORMAT_BEAUTY)} -  ${timeRangeEnd.utc().format(DATE_FORMAT_BEAUTY)}`,
          },
          name: FilterKey.TIME_RANGE,
        },
        entityState
      );
    }
    default: {
      return entityState;
    }
  }
};

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedFilters = selectAll;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: FilterState, action: Action): FilterState {
  return filterReducer(state, action);
}
