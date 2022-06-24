import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import moment from 'moment';

import {
  filterAdapter,
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
  filterSelected,
  loadOrgUnits,
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
  timePeriodSelected,
} from '../../actions/filter/filter.action';

export const filterKey = 'filter';
export interface FilterState {
  orgUnits: {
    loading: boolean;
    items: IdValue[];
    errorMessage: string;
  };
  timePeriods: IdValue[];
  selectedFilters: EntityState<SelectedFilter>; // currently selected filters
  selectedTimePeriod: TimePeriod;
}

const getInitialSelectedTimeRange = () => {
  // use month before to prevent wrong calculations for the future
  const nowDate = moment
    .utc()
    .endOf('month')
    .subtract(1, 'month')
    .endOf('month');
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

const initialTimeRange = getInitialSelectedTimeRange();

export const initialState: FilterState = {
  orgUnits: {
    loading: false,
    items: [],
    errorMessage: undefined,
  },
  timePeriods: [
    {
      id: TimePeriod.YEAR,
      value: TimePeriod.YEAR,
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
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
};

export const filterReducer = createReducer(
  initialState,
  on(
    loadOrgUnits,
    (state: FilterState): FilterState => ({
      ...state,
      orgUnits: {
        ...state.orgUnits,
        loading: true,
      },
    })
  ),
  on(
    loadOrgUnitsSuccess,
    (state: FilterState, { items }): FilterState => ({
      ...state,
      orgUnits: {
        ...state.orgUnits,
        loading: false,
        items,
      },
    })
  ),
  on(
    loadOrgUnitsFailure,
    (state: FilterState, { errorMessage }): FilterState => ({
      ...state,
      orgUnits: {
        ...state.orgUnits,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    filterSelected,
    (state: FilterState, { filter }): FilterState => ({
      ...state,
      selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
    })
  ),
  on(
    timePeriodSelected,
    (state: FilterState, { timePeriod }): FilterState => ({
      ...state,
      selectedTimePeriod: timePeriod,
    })
  )
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedFilters = selectAll;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: FilterState, action: Action): FilterState {
  return filterReducer(state, action);
}
