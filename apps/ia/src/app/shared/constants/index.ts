import { FilterDimension } from '../models';

export const LOCAL_STORAGE_APP_KEY = 'ia';
export const COMPANY_NAME = 'Schaeffler';
export const DATA_IMPORT_DAY = 9; // day of each month of data import from data provider
export const CONTENT_TYPE_APPLICATION_JSON = {
  'Content-Type': 'application/json',
};
export const FILTER_DIMENSIONS: {
  dimension: FilterDimension;
  level: number;
}[] = [
  { dimension: FilterDimension.ORG_UNIT, level: 0 },
  { dimension: FilterDimension.REGION, level: 0 },
  { dimension: FilterDimension.SUB_REGION, level: 1 },
  { dimension: FilterDimension.COUNTRY, level: 2 },
  { dimension: FilterDimension.BOARD, level: 0 },
  { dimension: FilterDimension.SUB_BOARD, level: 1 },
  { dimension: FilterDimension.FUNCTION, level: 2 },
  { dimension: FilterDimension.SUB_FUNCTION, level: 3 },
  { dimension: FilterDimension.SEGMENT, level: 0 },
  { dimension: FilterDimension.SUB_SEGMENT, level: 1 },
  { dimension: FilterDimension.SEGMENT_UNIT, level: 2 },
];

/** for autocomplete */
export const ASYNC_SEARCH_MIN_CHAR_LENGTH = 2;
export const LOCAL_SEARCH_MIN_CHAR_LENGTH = 0;

/** for roles handling */
export const GENERAL_ROLES_PREFIXES = ['IA_ADMIN', 'BASIC_ACCCESS'];
export const GEOGRAPHICAL_ROLES_PREFIXES = ['HR_PA'];

export const EXTENDED_LIST_ITEM_HEIGHT = 150;
