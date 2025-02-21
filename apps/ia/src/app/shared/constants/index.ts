import { Color, FilterDimension, TimePeriod } from '../models';

export const LOCAL_STORAGE_APP_KEY = 'ia';
export const COMPANY_NAME = 'Schaeffler';
export const DATA_IMPORT_DAY = 9; // day of each month of data import from data provider
export const DATE_FORMAT_BEAUTY = 'MMM YYYY';
export const CONTENT_TYPE_APPLICATION_JSON = {
  'Content-Type': 'application/json',
};
export const FILTER_DIMENSIONS: {
  dimension: FilterDimension;
  level: number;
}[] = [
  { dimension: FilterDimension.ORG_UNIT, level: 0 },
  { dimension: FilterDimension.PERSONAL_AREA, level: 0 },
  { dimension: FilterDimension.REGION, level: 0 },
  { dimension: FilterDimension.SUB_REGION, level: 1 },
  { dimension: FilterDimension.COUNTRY, level: 2 },
  { dimension: FilterDimension.HR_LOCATION, level: 3 },
  { dimension: FilterDimension.BOARD, level: 0 },
  { dimension: FilterDimension.SUB_BOARD, level: 1 },
  { dimension: FilterDimension.FUNCTION, level: 2 },
  { dimension: FilterDimension.SUB_FUNCTION, level: 3 },
  { dimension: FilterDimension.SEGMENT, level: 0 },
  { dimension: FilterDimension.SUB_SEGMENT, level: 1 },
  { dimension: FilterDimension.SEGMENT_UNIT, level: 2 },
];
export const EXPERITMENTAL_FILTER_DIMENSIONS = [
  { dimension: FilterDimension.JOB_FAMILY, level: 0 },
  { dimension: FilterDimension.JOB_SUB_FAMILY, level: 1 },
  { dimension: FilterDimension.JOB, level: 2 },
];

export const DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS = [
  FilterDimension.HR_LOCATION,
  FilterDimension.PERSONAL_AREA,
  FilterDimension.FUNCTION,
];

export const DIMENSIONS_WITH_2021_DATA = [
  FilterDimension.ORG_UNIT,
  FilterDimension.REGION,
  FilterDimension.SUB_REGION,
  FilterDimension.COUNTRY,
  FilterDimension.HR_LOCATION,
  FilterDimension.PERSONAL_AREA,
];

export const DEFAULT_TIME_PERIOD_FILTERS = [
  {
    id: TimePeriod.LAST_12_MONTHS,
    value: TimePeriod.LAST_12_MONTHS,
  },
  {
    id: TimePeriod.YEAR,
    value: TimePeriod.YEAR,
  },
  {
    id: TimePeriod.MONTH,
    value: TimePeriod.MONTH,
  },
];

export const LOSS_OF_SKILL_MIN_YEAR = 2022;

/** for autocomplete */
export const ASYNC_SEARCH_MIN_CHAR_LENGTH = 2;
export const LOCAL_SEARCH_MIN_CHAR_LENGTH = 0;

/** for roles handling */
export const GENERAL_ROLES_PREFIXES = ['IA_ADMIN', 'BASIC_ACCCESS'];
export const GEOGRAPHICAL_ROLES_PREFIXES = ['HR_PA'];

export const BASIC_LIST_ITEM_HEIGHT = 120;
export const EXTENDED_LIST_ITEM_HEIGHT = 150;

/** loading spinner for echarts **/
export const LOADING_OPTS = {
  text: '',
  color: Color.GREEN,
  zlevel: 0,
};
