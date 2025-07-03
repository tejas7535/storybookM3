import { EntityState } from '@ngrx/entity';
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
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../../../shared/utils/utilities';

/**
 * Get max date based on data import rules
 */
export function getMaxDate(): number {
  const maxDate: Moment = moment()
    .utc()
    .subtract(DATA_IMPORT_DAY, 'days') // use previous month if data is not imported yet
    .subtract(1, 'month')
    .endOf('month');

  return maxDate.unix();
}

/**
 * Get initial selected time range
 */
export const getInitialSelectedTimeRange = (today: Moment): string => {
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

/**
 * Get max time range constraint based on time period
 * - For YEAR, it returns the end of the previous year
 * - For other periods, it returns the current max date
 */
export const getMaxTimeRangeConstraint = (timePeriod: TimePeriod) =>
  timePeriod === TimePeriod.YEAR
    ? moment.unix(getMaxDate()).utc().subtract(1, 'year').endOf('year').unix()
    : getMaxDate();

/**
 * Get minimum time range constraint based on selected dimension
 * - For dimensions with 2021 data, it returns the start of 2022
 * - For other dimensions, it returns the start of 2023
 */
export const getMinTimeRangeConstraint = (
  selectedDimension: FilterDimension
) =>
  DIMENSIONS_WITH_2021_DATA.includes(selectedDimension)
    ? moment.utc('2022-01-01').unix()
    : moment.utc('2023-01-01').unix();

/**
 * Get time range filter for specific time period
 */
export const getTimeRangeFilterForTimePeriod = (
  timePeriod: TimePeriod,
  entityState: EntityState<SelectedFilter>
): EntityState<SelectedFilter> => {
  const currentTimeRangeEnd = moment
    .unix(+entityState.entities[FilterKey.TIME_RANGE].idValue.id.split('|')[1])
    .utc();

  switch (timePeriod) {
    case TimePeriod.YEAR: {
      return getYearTimeRangeFilter(currentTimeRangeEnd, entityState);
    }
    case TimePeriod.MONTH: {
      return getMonthTimeRangeFilter(currentTimeRangeEnd, entityState);
    }
    case TimePeriod.LAST_12_MONTHS: {
      return getLast12MonthsTimeRangeFilter(currentTimeRangeEnd, entityState);
    }
    default: {
      return entityState;
    }
  }
};

/**
 * Get year time range filter
 */
function getYearTimeRangeFilter(
  currentTimeRangeEnd: Moment,
  entityState: EntityState<SelectedFilter>
): EntityState<SelectedFilter> {
  const currentDate = moment.utc().subtract(DATA_IMPORT_DAY, 'days');
  const timeRangeStart =
    currentTimeRangeEnd.year() === currentDate.year()
      ? currentTimeRangeEnd.clone().utc().subtract(1, 'year').startOf('year')
      : currentTimeRangeEnd.clone().utc().startOf('year');
  const timeRangeEnd = timeRangeStart.clone().utc().endOf('year');

  return createTimeRangeFilter({
    id: `${timeRangeStart.unix()}|${timeRangeEnd.unix()}`,
    value: `${timeRangeEnd.utc().format('YYYY')}`,
    entityState,
  });
}

/**
 * Get month time range filter
 */
function getMonthTimeRangeFilter(
  currentTimeRangeEnd: Moment,
  entityState: EntityState<SelectedFilter>
): EntityState<SelectedFilter> {
  const timeRangeStart = currentTimeRangeEnd.clone().utc().startOf('month');
  const timeRangeEnd = currentTimeRangeEnd.clone().utc().endOf('month');

  return createTimeRangeFilter({
    id: `${timeRangeStart.utc().unix()}|${timeRangeEnd.utc().unix()}`,
    value: timeRangeStart.utc().format(DATE_FORMAT_BEAUTY),
    entityState,
  });
}

/**
 * Get last 12 months time range filter
 */
function getLast12MonthsTimeRangeFilter(
  currentTimeRangeEnd: Moment,
  entityState: EntityState<SelectedFilter>
): EntityState<SelectedFilter> {
  const timeRangeStart = getMonth12MonthsAgo(currentTimeRangeEnd);
  const timeRangeEnd = currentTimeRangeEnd.clone().utc().endOf('month');

  return createTimeRangeFilter({
    id: `${timeRangeStart.utc().unix()}|${timeRangeEnd.utc().unix()}`,
    value: `${timeRangeStart.utc().format(DATE_FORMAT_BEAUTY)} -  ${timeRangeEnd.utc().format(DATE_FORMAT_BEAUTY)}`,
    entityState,
  });
}

/**
 * Create time range filter
 */
function createTimeRangeFilter({
  id,
  value,
  entityState,
}: {
  id: string;
  value: string;
  entityState: EntityState<SelectedFilter>;
}): EntityState<SelectedFilter> {
  return filterAdapter.upsertOne(
    {
      idValue: { id, value },
      name: FilterKey.TIME_RANGE,
    },
    entityState
  );
}

/**
 * Get time range constraints based on selected dimension
 */
export function getTimeRangeConstraints(
  selectedDimension: FilterDimension,
  currentConstraints: { min: number; max: number }
): { min: number; max: number } {
  return {
    ...currentConstraints,
    min: getMinTimeRangeConstraint(selectedDimension),
  };
}
